import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 border-t border-gray-900 relative pt-16 md:pt-20 pb-10 overflow-hidden">
      
      {/* --- BACKGROUND DECOR --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-y-12 gap-x-8 mb-12 md:mb-16">
          
          {/* 1. BRAND & MISSION (Centered on mobile, Left on Desktop) */}
          <div className="col-span-2 md:col-span-4 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-900/20 group-hover:scale-105 transition-transform duration-300">
                ⏱️
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                ClientTime
              </span>
            </Link>
            
            <p className="text-gray-400 leading-relaxed text-sm max-w-sm mx-auto md:mx-0">
              The professional's choice for time tracking and invoicing. Built for freelancers who value their time.
            </p>
            
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              All Systems Operational
            </div>
          </div>

          {/* 2. NAVIGATION LINKS (Mobile: Centered Block, Left Aligned Text) */}
          
          {/* PRODUCT COLUMN */}
          <div className="col-span-1 md:col-span-2">
            {/* Wrapper: Centers the block (mx-auto) but keeps text left (items-start) */}
            <div className="flex flex-col items-start w-fit mx-auto md:mx-0">
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-4 text-left">
                <FooterLink to="/dashboard">Dashboard</FooterLink>
                <FooterLink to="/clients">Clients</FooterLink>
                <FooterLink to="/invoices">Invoices</FooterLink>
                <FooterLink to="/pricing">Pricing</FooterLink>
              </ul>
            </div>
          </div>

          {/* COMPANY COLUMN */}
          <div className="col-span-1 md:col-span-2">
             <div className="flex flex-col items-start w-fit mx-auto md:mx-0">
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-4 text-left">
                <FooterLink to="#">About Us</FooterLink>
                <FooterLink to="#">Careers</FooterLink>
                <FooterLink to="#">Blog</FooterLink>
                <FooterLink to="#">Contact</FooterLink>
              </ul>
            </div>
          </div>

          {/* 3. NEWSLETTER (Centered on mobile) */}
          <div className="col-span-2 md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-white font-semibold mb-4">Stay productive</h4>
            <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto md:mx-0">
              Join 10,000+ creators getting productivity tips bi-weekly.
            </p>
            
            <form className="relative w-full max-w-sm group">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-gray-900/50 border border-gray-800 text-gray-200 text-sm rounded-xl pl-4 pr-14 py-3 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder-gray-600"
              />
              <button 
                type="button"
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-gray-800 hover:bg-cyan-600 text-gray-400 hover:text-white px-3 rounded-lg transition-colors border border-gray-700 hover:border-cyan-500"
              >
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* --- DIVIDER --- */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-8" />

        {/* --- BOTTOM BAR --- */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-gray-500 text-xs">
            © {currentYear} ClientTime Inc. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <SocialLink href="#" icon={<TwitterIcon />} label="Twitter" />
            <SocialLink href="#" icon={<GitHubIcon />} label="GitHub" />
            <SocialLink href="#" icon={<LinkedInIcon />} label="LinkedIn" />
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- SUB-COMPONENTS ---

function FooterLink({ to, children }) {
  return (
    <li>
      {/* justify-start ensures text stays left-aligned */}
      <Link to={to} className="group flex items-center justify-start gap-2 w-fit">
        <motion.span
          className="text-gray-400 text-sm group-hover:text-cyan-400 transition-colors"
          whileHover={{ x: 2 }}
        >
          {children}
        </motion.span>
      </Link>
    </li>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -2, scale: 1.1 }}
      className="text-gray-500 hover:text-white transition-colors"
      aria-label={label}
    >
      <div className="w-5 h-5">
        {icon}
      </div>
    </motion.a>
  );
}

// --- ICONS (SVG) ---
// (Icons remain unchanged)
function ArrowRightIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
    </svg>
  );
}