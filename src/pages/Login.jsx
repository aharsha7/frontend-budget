import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("aharsha7@gmail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex flex-col mt-28">
      <div className="flex flex-1 flex-wrap ">
        {/* Left Side (Background / Design) */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-cover bg-center p-6">
          <div className="text-white text-center p-8 bg-gradient-to-r from-green-600 to-black bg-opacity-80 rounded-lg">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome back to Budget Tracker!
            </h1>
            <p className="text-sm md:text-lg">
              Manage your finances smartly and stay on top of your goals.
            </p>
          </div>
        </div>

        {/* Right Side (Login Form) */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
          <div className="w-full max-w-md px-4">
            <form
              onSubmit={handleLogin}
              className="bg-white p-6 rounded-xl shadow-xl"
            >
              {/* Logo Header */}
              <div className="flex justify-center mb-4">
                <img
                  src="/download.jpeg"
                  alt="Login Logo"
                  className="h-18 w-20 rounded-full bg-opacity-10"
                />
              </div>

              <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
                Budget Tracker Login
              </h2>

              {/* Email Input */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-lock"></i>
                  </div>
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-2 rounded mb-3">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-lg hover:rounded-full hover:from-green-700 hover:to-green-800">
                Login
              </button>

              {/* Sign Up Link */}
              <p className="mt-3 text-center text-sm text-gray-700">
                Don't have an account?{" "}
                <span
                  className="text-green-600 cursor-pointer hover:text-green-700 font-medium underline"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
