import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for user data in localStorage on component mount
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (token && username) {
      // Fallback for older implementations using separate token/username
      const userData = { name: username };
      setUser(userData);
      // Standardize by storing as user object
      localStorage.setItem("user", JSON.stringify(userData));
    }
  }, []);

  // Login function to set user and save to localStorage
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Logout function to clear user and remove from localStorage
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);