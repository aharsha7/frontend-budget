import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import TransactionTable from "./components/TransactionTable";

const App = () => {
  const [username, setUsername] = useState(localStorage.getItem("username"));

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = localStorage.getItem("username");
      if (updated !== username) setUsername(updated);
    }, 500);
    return () => clearInterval(interval);
  }, [username]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar username={username} />
        <Routes>
          <Route path="/" element={<Login />}  />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        {/* <TransactionTable /> */}
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;