import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-gray-950 border-t border-gray-900 relative overflow-hidden pt-16 pb-8">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand */}
          <motion.div variants={itemVariants} className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-3xl group-hover:rotate-12 transition-transform duration-300 block">
                ⏱️
              </span>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                ClientTime
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Stop guessing how much you worked. Track hours, bill clients, and get paid without the headache.
            </p>
          </motion.div>

          {/* Column 2: Product */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              <FooterLink to="/dashboard">Dashboard</FooterLink>
              <FooterLink to="/clients">Clients</FooterLink>
              <FooterLink to="/invoices">Invoices</FooterLink>
              <FooterLink to="/register">Start for Free</FooterLink>
            </ul>
          </motion.div>

          {/* Column 3: Company */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <FooterLink to="#">About Us</FooterLink>
              <FooterLink to="#">Careers (We're hiring!)</FooterLink>
              <FooterLink to="#">Privacy Policy</FooterLink>
              <FooterLink to="#">Terms of Service</FooterLink>
            </ul>
          </motion.div>

          {/* Column 4: Newsletter */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-bold mb-4">Stay in the loop</h4>
            <p className="text-gray-400 text-sm mb-4">
              Get productivity hacks sent to your inbox. No spam, we promise.
            </p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="you@awesome.com" 
                className="bg-gray-900 border border-gray-800 text-gray-200 text-sm rounded-lg px-3 py-2 w-full focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg px-3 py-2 transition-colors">
                →
              </button>
            </form>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="h-px w-full bg-gray-900 mb-8" />

        {/* Bottom Bar */}
        <motion.div 
          variants={itemVariants} 
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-500 text-sm">
            © {currentYear} ClientTime Inc. Made with ☕ and React.
          </p>
          
          {/* Social Icons */}
          <div className="flex gap-4">
            <SocialIcon label="Twitter" />
            <SocialIcon label="GitHub" />
            <SocialIcon label="LinkedIn" />
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}

// Helper: Animated Link
function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="block w-fit">
        <motion.span
          className="text-gray-400 text-sm inline-block"
          whileHover={{ x: 5, color: "#22d3ee" }} // Move right and turn cyan
          transition={{ type: "spring", stiffness: 300 }}
        >
          {children}
        </motion.span>
      </Link>
    </li>
  );
}

// Helper: Social Icon Placeholder
function SocialIcon({ label }) {
  return (
    <motion.a
      href="#"
      whileHover={{ y: -3, color: "#fff" }}
      className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 transition-colors hover:border-cyan-500/50 hover:bg-cyan-900/20"
      title={label}
    >
      <span className="text-xs">🔗</span>
    </motion.a>
  );
}