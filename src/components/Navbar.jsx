import { useAuth } from "../auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { User } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    logout();
    navigate("/", { replace: true });  
  };
  

  const handleNavigate = (path) => {
    navigate(path);
  };

  const onSignupPage = location.pathname === "/signup";

  return (
    <div className="bg-gradient-to-r from-green-600 to-gray-900 text-white flex justify-between items-center p-3">
      <h1 className="text-xl font-bold flex items-center">
        <img
          src="/navbar2.jpeg"
          alt="Navbar Logo"
          className="h-10 w-12 rounded-full mr-2"
        />
        <span>Budget Tracker</span>
      </h1>

      {!user ? (
        <div className="flex gap-4">
          {onSignupPage ? (
            <button
              onClick={() => handleNavigate("/")}
              className="bg-white text-green-700 px-4 py-2 rounded-2xl hover:bg-green-100"
            >
              Login
            </button>
          ) : (
            <>  
              <button
                onClick={() => handleNavigate("/signup")}
                className="bg-white text-green-700 px-4 py-2 rounded-2xl hover:bg-green-100"
              >
                Signup
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <User size={20} />
            <span>{user.name}</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-10">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
