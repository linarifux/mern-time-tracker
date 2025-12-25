import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full left-0 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800 shadow-lg shadow-cyan-900/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* --- LOGO --- */}
        <Link to="/" className="group flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 20 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-2xl"
          >
            ⏱️
          </motion.div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-blue-500 group-hover:to-cyan-300 transition-all">
            ClientTime
          </span>
        </Link>

        {/* --- NAVIGATION LINKS --- */}
        <div className="flex items-center gap-1">
          {user ? (
            <>
              {/* Authenticated Links */}
              <NavItem to="/dashboard" currentPath={location.pathname}>Dashboard</NavItem>
              <NavItem to="/clients" currentPath={location.pathname}>Clients</NavItem>
              <NavItem to="/invoices" currentPath={location.pathname}>Invoices</NavItem>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-800 mx-3 hidden sm:block" />

              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="ml-2 px-4 py-2 text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <>
              {/* Guest Links */}
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
      </div>
    </nav>
  );
}

// --- SUB-COMPONENT: Animated Link Item ---
function NavItem({ to, children, currentPath }) {
  // Check if this link is active
  // We use startsWith to keep it active for sub-routes if needed, or strictly equal
  const isActive = currentPath === to;

  return (
    <Link to={to} className="relative px-4 py-2 text-sm font-medium transition-colors">
      {/* Text Layer */}
      <span className={`relative z-10 ${isActive ? 'text-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}>
        {children}
      </span>

      {/* Animated Background Pill */}
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