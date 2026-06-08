import { Link } from 'react-router-dom';
import { GraduationCap, Code, Send, Globe, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[var(--color-base)] border-t border-slate-800 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Logo/Tagline */}
          <div className="flex flex-col">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <GraduationCap className="h-8 w-8 text-[var(--color-primary)] group-hover:rotate-12 transition-transform" />
              <span className="font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                CodeCamp
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The modern way to learn web development. Watch tutorials, code live, and get AI-powered help—all for free.
            </p>
          </div>

          {/* Column 2: Learn Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Learn</h4>
            <ul className="space-y-3">
              <li><Link to="/learn" className="text-slate-400 hover:text-white transition-colors text-sm">HTML Basics</Link></li>
              <li><Link to="/learn" className="text-slate-400 hover:text-white transition-colors text-sm">CSS Styling</Link></li>
              <li><Link to="/learn" className="text-slate-400 hover:text-white transition-colors text-sm">JavaScript</Link></li>
              <li><Link to="/learn" className="text-slate-400 hover:text-white transition-colors text-sm">React.js</Link></li>
              <li><Link to="/challenges" className="text-slate-400 hover:text-white transition-colors text-sm">Coding Challenges</Link></li>
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/pricing" className="text-slate-400 hover:text-white transition-colors text-sm">Pricing (Pro)</Link></li>
              <li><Link to="/community" className="text-slate-400 hover:text-white transition-colors text-sm">Community</Link></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li><a href="mailto:hello@codecamp.com" className="text-slate-400 hover:text-white transition-colors text-sm">hello@codecamp.com</a></li>
              <li><p className="text-slate-400 text-sm">Kathmandu, Nepal</p></li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Send className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Code className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Globe className="h-5 w-5" /></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} CodeCamp. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-slate-500 text-sm">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> in Nepal
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
