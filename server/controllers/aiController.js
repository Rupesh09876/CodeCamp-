const axios = require('axios');
const User = require('../models/User');

const FREE_TIER_LIMIT = parseInt(process.env.AI_FREE_DAILY_LIMIT) || 10;

exports.askAI = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const now = new Date();
    const lastReset = user.lastQueryReset ? new Date(user.lastQueryReset) : new Date(0);

    if (lastReset.toDateString() !== now.toDateString()) {
      user.aiQueriesUsedToday = 0;
      user.lastQueryReset = now;
    }

    if (user.plan === 'free' && (user.aiQueriesUsedToday || 0) >= FREE_TIER_LIMIT) {
      return res.status(429).json({ msg: 'Daily AI limit reached. Upgrade to Pro for unlimited access.' });
    }

    const { query, question, context, code } = req.body;
    const userQuestion = query || question || "Explain this code";
    const userCode = context || code || "";

    const systemPrompt = "You are the 'CodeCamp Elite AI Tutor', a world-class senior software engineer and teaching assistant. " +
                         "Provide extremely helpful, precise, and encouraging guidance. " +
                         "When explaining code, use analogies and best practices. " +
                         "If the user asks to fix code, provide the corrected snippet inside a markdown code block. " +
                         "Keep responses under 250 words and prioritize clarity.";

    let responseText = "";

    // Use Featherless AI as requested
    const apiKey = process.env.FEATHERLESS_API_KEY;
    const apiUrl = process.env.FEATHERLESS_API_URL || 'https://api.featherless.ai/v1';
    const modelName = process.env.DEEPSEEK_MODEL || 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B';

    if (!apiKey) {
      return res.status(500).json({ msg: 'AI configuration error: Missing API Key' });
    }

    try {
      const aiRes = await axios.post(`${apiUrl}/chat/completions`, {
        model: modelName,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Context/Code:\n${userCode}\n\nQuestion: ${userQuestion}` }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const message = aiRes.data.choices[0].message;
      // DeepSeek-R1 models often return their output in the 'reasoning' or 'reasoning_content' field instead of 'content'
      responseText = message.content || message.reasoning || message.reasoning_content || "";
    } catch (aiErr) {
      console.error('Featherless AI Error:', aiErr.response?.data || aiErr.message);
      const errorDetail = aiErr.response?.data?.error?.message || aiErr.message;
      throw new Error(`Featherless API Error: ${errorDetail}`);
    }

    if (!responseText) {
      throw new Error('Empty response from AI service');
    }

    user.aiQueriesUsedToday = (user.aiQueriesUsedToday || 0) + 1;
    await user.save();

    res.json({ response: responseText, queriesUsed: user.aiQueriesUsedToday });

  } catch (err) {
    console.error('--- AI TUTOR ERROR ---');
    console.error('Message:', err.message);
    if (err.response?.data) console.error('API Response:', JSON.stringify(err.response.data));

    // Handle specific errors
    if (err.response?.status === 429 || err.message?.includes('429') || err.message?.includes('Concurrency')) {
      return res.status(429).json({ msg: `AI Limit Exceeded: ${err.message}` });
    }
    if (err.response?.status === 401 || err.response?.status === 403 || err.message?.includes('403')) {
      return res.status(503).json({ msg: `AI Auth Error: ${err.message}` });
    }

    res.status(500).json({ msg: `AI Error: ${err.message || 'Internal Server Error'}` });
  }
};

exports.getUsage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const now = new Date();
    
    if (user.lastQueryReset && user.lastQueryReset.getDate() !== now.getDate()) {
      user.aiQueriesUsedToday = 0;
      user.lastQueryReset = now;
      await user.save();
    }
    
    res.json({
      used: user.aiQueriesUsedToday,
      limit: user.plan === 'pro' ? 'Unlimited' : FREE_TIER_LIMIT,
      plan: user.plan
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
