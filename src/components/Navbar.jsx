import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { User } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate("/");
  };

  return (
    <div className="bg-blue-900 text-white flex justify-between items-center p-4">
      <h1 className="text-xl font-bold">Budget Tracker</h1>

      {user && (
        <div className="relative">
          {/* Username and Dropdown Toggle */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown visibility
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

          {/* Dropdown Menu */}
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
