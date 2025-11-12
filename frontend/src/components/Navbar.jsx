import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
const { user, logout } = useAuth()
const navigate = useNavigate()

const handleLogout = () => {
logout()
navigate('/login')
}

return ( <nav className="sticky top-0 z-20 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-3 flex items-center justify-between shadow-md"> <div className="flex items-center space-x-2"> <span className="text-cyan-400 text-xl font-bold">⏱️ Client Time Tracker</span> </div>

  <div className="flex items-center space-x-6">
    {user ? (
      <>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-sm font-medium hover:text-cyan-400 transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-300'}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/clients"
          className={({ isActive }) =>
            `text-sm font-medium hover:text-cyan-400 transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-300'}`
          }
        >
          Clients
        </NavLink>
        <NavLink
          to="/invoices"
          className={({ isActive }) =>
            `text-sm font-medium hover:text-cyan-400 transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-300'}`
          }
        >
          Invoices
        </NavLink>
        <button
          onClick={handleLogout}
          className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-md transition-colors"
        >
          Logout
        </button>
      </>
    ) : (
      <>
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `text-sm font-medium hover:text-cyan-400 transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-300'}`
          }
        >
          Login
        </NavLink>
        <NavLink
          to="/register"
          className={({ isActive }) =>
            `text-sm font-medium hover:text-cyan-400 transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-300'}`
          }
        >
          Register
        </NavLink>
      </>
    )}
  </div>
</nav>
)
}