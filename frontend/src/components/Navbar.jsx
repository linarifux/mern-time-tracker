import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  // Helper to close menu when clicking a link
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-950/80 backdrop-blur-lg border-b border-gray-800 shadow-lg shadow-cyan-900/5">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* --- LOGO --- */}
          <Link to="/" className="group flex items-center gap-2" onClick={closeMenu}>
            <motion.div
              whileHover={{ rotate: 20 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-2xl"
            >
              ⏱️
            </motion.div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:to-cyan-300 transition-all">
              ClientTime
            </span>
          </Link>

          {/* --- DESKTOP NAVIGATION (Hidden on Mobile) --- */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <NavItem to="/dashboard" currentPath={location.pathname}>Dashboard</NavItem>
                <NavItem to="/clients" currentPath={location.pathname}>Clients</NavItem>
                <NavItem to="/invoices" currentPath={location.pathname}>Invoices</NavItem>

                <div className="h-6 w-px bg-gray-800 mx-3" />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Log In
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-gray-900 rounded-lg shadow-lg shadow-cyan-500/20 transition-all"
                  >
                    Start Free
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* --- MOBILE MENU BUTTON (Visible on Mobile) --- */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <span className="text-2xl">✕</span> // Close Icon
            ) : (
              <span className="text-2xl">☰</span> // Hamburger Icon
            )}
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-gray-950 border-t border-gray-800"
          >
            <div className="px-6 py-6 space-y-4 flex flex-col">
              {user ? (
                <>
                  <MobileNavItem to="/dashboard" onClick={closeMenu}>Dashboard</MobileNavItem>
                  <MobileNavItem to="/clients" onClick={closeMenu}>Clients</MobileNavItem>
                  <MobileNavItem to="/invoices" onClick={closeMenu}>Invoices</MobileNavItem>
                  
                  <div className="h-px bg-gray-800 my-2" />
                  
                  <button 
                    onClick={handleLogout}
                    className="text-left text-red-400 font-semibold py-2 hover:text-red-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <MobileNavItem to="/login" onClick={closeMenu}>Log In</MobileNavItem>
                  <Link to="/register" onClick={closeMenu}>
                    <button className="w-full py-3 mt-2 text-center font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-lg transition-all">
                      Start Free
                    </button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// --- SUB-COMPONENT: Desktop Nav Item ---
function NavItem({ to, children, currentPath }) {
  const isActive = currentPath === to;

  return (
    <Link to={to} className="relative px-4 py-2 text-sm font-medium transition-colors">
      <span className={`relative z-10 ${isActive ? 'text-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}>
        {children}
      </span>
      {isActive && (
        <motion.div
          layoutId="navbar-active"
          className="absolute inset-0 bg-gray-800 rounded-lg"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
}

// --- SUB-COMPONENT: Mobile Nav Item ---
function MobileNavItem({ to, children, onClick }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="block text-lg font-medium text-gray-300 hover:text-cyan-400 hover:pl-2 transition-all duration-300"
    >
      {children}
    </Link>
  );
}