import { useState } from 'react';
import { CheckCircle2, Lock, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import Button from '../components/UI/Button';
import api from '../api';

const Pricing = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleKhaltiPayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const res = await api.post('/payment/khalti/initiate', { amount: 500, plan: 'monthly' });

      if (res.data && res.data.payment_url) {
        // Redirect to Khalti checkout page
        window.location.href = res.data.payment_url;
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Failed to initiate payment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: "Is CodeCamp really free?",
      a: "Yes! All of our core curriculum, standard video lessons, and the basic coding environment will always be free. We believe everyone in Nepal should have access to quality tech education."
    },
    {
      q: "What do I get with the Pro plan?",
      a: "Pro gives you unlimited access to our AI tutor, verified certificates upon completion, offline lesson downloads, priority support, and exclusive Pro-level challenges."
    },
    {
      q: "Can I cancel my subscription anytime?",
      a: "Absolutely. You can manage your subscription directly from your account settings and cancel at any time. You will retain access to Pro features until the end of your billing cycle."
    },
    {
      q: "Do you offer student discounts?",
      a: "Our free tier is already designed to be fully accessible to students. However, if you're a student looking for Pro features, keep an eye on our community page for special scholarship opportunities."
    },
    {
      q: "What payment methods do you support?",
      a: "We currently support secure payments via Khalti, making it easy for users across Nepal to upgrade seamlessly without needing an international credit card."
    }
  ];

  return (
    <div className="flex flex-col bg-[var(--color-base)] text-[var(--color-text-primary)] h-full py-12 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 w-full">
        {/* HEADER */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight">Simple, honest pricing</h1>
          <p className="text-xl text-[var(--color-text-secondary)]">Start for free. Upgrade when you want more.</p>
        </div>

        {/* PRICING CARDS */}
        <div className="flex flex-col lg:flex-row justify-center gap-8 mb-24 max-w-5xl mx-auto">
          {/* FREE CARD */}
          <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-8 flex flex-col shadow-sm">
            <h3 className="text-2xl font-bold mb-2 text-slate-900">Free</h3>
            <p className="text-slate-500 mb-6 font-medium">Perfect for getting started</p>
            <div className="text-4xl font-extrabold mb-8 text-slate-900">Rs. 0 <span className="text-lg font-medium text-slate-400">/ forever</span></div>
            
            <ul className="space-y-4 mb-8 flex-grow text-slate-700 font-medium">
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Full curriculum access</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Standard challenges</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Live code editor</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Community forum</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Basic AI hints (5/day)</li>
              <li className="flex items-center gap-3 text-slate-400"><Lock className="h-4 w-4" /> Unlimited AI explanations</li>
              <li className="flex items-center gap-3 text-slate-400"><Lock className="h-4 w-4" /> Certificates of completion</li>
            </ul>
            
            <Button variant="outline" className="w-full mt-auto font-bold">Get Started Free</Button>
          </div>

          {/* PRO CARD */}
          <div className="flex-1 bg-white border-2 border-indigo-500 rounded-3xl p-8 relative shadow-2xl shadow-indigo-500/10 transform lg:scale-105 z-10 flex flex-col">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] font-extrabold px-4 py-1.5 rounded-full tracking-widest shadow-lg uppercase">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold mb-2 text-slate-900">Pro</h3>
            <p className="text-slate-500 mb-6 font-medium">For serious learners</p>
            <div className="text-4xl font-extrabold mb-8 text-slate-900">Rs. 500 <span className="text-lg font-medium text-slate-400">/ month</span></div>
            
            <ul className="space-y-4 mb-8 flex-grow text-slate-700 font-medium">
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Everything in Free</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Unlimited AI Tutor help</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Verified Certificates</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Offline lesson downloads</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Priority 1-on-1 support</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Exclusive Pro challenges</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Early access to new courses</li>
            </ul>
            
            <div className="mt-auto">
              <Button 
                className="w-full py-4 mb-3 text-base bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100" 
                onClick={handleKhaltiPayment}
                disabled={loading}
              >
                {loading ? <span className="flex items-center gap-2"><Loader className="w-5 h-5 animate-spin" /> Processing...</span> : 'Upgrade with Khalti'}
              </Button>
              <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">Secure Nepal payment via Khalti</p>
            </div>
          </div>
        </div>

        {/* COMPARISON TABLE */}
        <div className="max-w-4xl mx-auto mb-24">
          <h2 className="text-3xl font-extrabold text-center mb-10 text-slate-900">Compare Plans</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-6 font-bold text-slate-900">Features</th>
                  <th className="p-6 font-bold text-slate-900 text-center w-1/4">Free</th>
                  <th className="p-6 font-bold text-indigo-600 text-center w-1/4">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">Access to all video lessons</td>
                  <td className="p-6 text-center"><CheckCircle2 className="inline h-5 w-5 text-emerald-500" /></td>
                  <td className="p-6 text-center"><CheckCircle2 className="inline h-5 w-5 text-indigo-500" /></td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">Live code editor environment</td>
                  <td className="p-6 text-center"><CheckCircle2 className="inline h-5 w-5 text-emerald-500" /></td>
                  <td className="p-6 text-center"><CheckCircle2 className="inline h-5 w-5 text-indigo-500" /></td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">Community forum access</td>
                  <td className="p-6 text-center"><CheckCircle2 className="inline h-5 w-5 text-emerald-500" /></td>
                  <td className="p-6 text-center"><CheckCircle2 className="inline h-5 w-5 text-indigo-500" /></td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">AI Tutor assistance</td>
                  <td className="p-6 text-center text-sm font-bold text-slate-500">5 requests/day</td>
                  <td className="p-6 text-center text-sm font-bold text-indigo-600">Unlimited</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">Verified Certificates</td>
                  <td className="p-6 text-center"><Lock className="inline h-4 w-4 text-slate-300" /></td>
                  <td className="p-6 text-center"><CheckCircle2 className="inline h-5 w-5 text-indigo-500" /></td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">Offline video downloads</td>
                  <td className="p-6 text-center"><Lock className="inline h-4 w-4 text-slate-300" /></td>
                  <td className="p-6 text-center"><CheckCircle2 className="inline h-5 w-5 text-indigo-500" /></td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">Pro-level coding challenges</td>
                  <td className="p-6 text-center"><Lock className="inline h-4 w-4 text-slate-300" /></td>
                  <td className="p-6 text-center"><CheckCircle2 className="inline h-5 w-5 text-indigo-500" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ ACCORDION */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-10 text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <button 
                  className="w-full px-6 py-5 flex justify-between items-center focus:outline-none text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-bold text-lg text-slate-900">{faq.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 text-slate-600 font-medium leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Pricing;
