const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Notification = require('../models/Notification');

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || 'test_secret_key_xxxxxxxxxxxxxxxxxxxxx';

// Initiate Khalti Payment
router.post('/khalti/initiate', auth, async (req, res) => {
  try {
    const { amount, plan } = req.body;
    
    // Fetch full user details since auth middleware only provides id/role
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Create pending payment record
    const payment = new Payment({
      userId: user._id,
      amount,
      plan,
      status: 'pending'
    });
    await payment.save();

    const payload = {
      return_url: `${process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5175'}/dashboard`,
      website_url: process.env.FRONTEND_URL || 'http://localhost:5173',
      amount: amount * 100, // Khalti expects amount in paisa
      purchase_order_id: payment._id.toString(),
      purchase_order_name: `CodeCamp ${plan} Subscription`,
      customer_info: {
        name: user.name || 'User',
        email: user.email || 'user@example.com',
        phone: '9800000000'
      }
    };

    console.log('Initiating Khalti with payload:', JSON.stringify(payload, null, 2));

    const response = await axios.post('https://a.khalti.com/api/v2/epayment/initiate/', payload, {
      headers: {
        'Authorization': `Key ${KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.payment_url) {
      payment.khaltiToken = response.data.pidx;
      await payment.save();
      
      res.json({ payment_url: response.data.payment_url, pidx: response.data.pidx });
    } else {
      res.status(400).json({ msg: 'Failed to initiate payment with Khalti' });
    }
  } catch (err) {
    console.error('Khalti Initiate Error:', err.response ? err.response.data : err.message);
    res.status(500).json({ 
      msg: 'Server Error during payment initiation', 
      error: err.response ? err.response.data : err.message 
    });
  }
});

// Verify Khalti Payment
router.post('/khalti/verify', auth, async (req, res) => {
  try {
    const { pidx } = req.body;
    
    if (!pidx) {
      return res.status(400).json({ msg: 'pidx is required' });
    }

    const payment = await Payment.findOne({ khaltiToken: pidx });
    if (!payment) {
      return res.status(404).json({ msg: 'Payment record not found' });
    }

    const response = await axios.post('https://a.khalti.com/api/v2/epayment/lookup/', { pidx }, {
      headers: {
        'Authorization': `Key ${KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.status === 'Completed') {
      // Payment Successful
      payment.status = 'success';
      payment.khaltiTransactionId = response.data.transaction_id;
      await payment.save();

      // Update User Plan
      const user = await User.findById(req.user.id);
      user.plan = 'pro';
      
      const startDate = new Date();
      const endDate = new Date();
      if (payment.plan === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      user.subscription = {
        status: 'active',
        startDate,
        endDate,
        khaltiPaymentId: payment.khaltiTransactionId
      };
      
      await user.save();
      
      // Notify User
      const userNotif = new Notification({
        user: user._id,
        title: 'Upgrade Successful! 👑',
        message: `Welcome to the PRO family! Your ${payment.plan} plan is now active.`,
        type: 'success'
      });
      await userNotif.save();

      // Notify Admins
      const adminNotif = new Notification({
        user: null,
        title: 'New Pro Subscriber! 💰',
        message: `${user.name} upgraded to ${payment.plan} plan. (Rs. ${payment.amount})`,
        type: 'success'
      });
      await adminNotif.save();
      
      res.json({ msg: 'Payment successful, upgraded to Pro!', user });
    } else {
      payment.status = 'failed';
      await payment.save();
      res.status(400).json({ msg: 'Payment verification failed', status: response.data.status });
    }
  } catch (err) {
    console.error('Khalti Verify Error:', err.response ? err.response.data : err.message);
    res.status(500).json({ msg: 'Server Error during payment verification' });
  }
});

// Get User Payment History
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error('Payment History Error:', err.message);
    res.status(500).json({ msg: 'Server Error fetching payment history' });
  }
});

module.exports = router;
