import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../services/ApiUrl";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const notyf = new Notyf({
    position: { x: "right", y: "top" },
    duration: 4000,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = form;
    const newErrors = {};

    if (!name) newErrors.name = "Name is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email address.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
        confirm_password: password,
      });

      console.log("Signup response:", res.data);

      // Clear any tokens so PublicRoute doesn't auto redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("username");

      notyf.success("Account created! Please log in.");
      navigate("/"); // Go to login page

    } catch (error) {
      console.error("Signup error:", error);

      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;

      if (msg === "Email already registered") {
        setErrors({ email: "Email already registered." });
        notyf.error("Email already registered. Please try again.");
      } else {
        setErrors({ general: msg || "Signup failed. Please try again." });
        notyf.error(msg || "Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col mt-20 ">
      <div className="flex flex-1 flex-wrap ">
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-cover bg-center">
         
          <div className="text-white text-center p-8 bg-gradient-to-r from-green-600 to-black bg-opacity-80 rounded-lg">
            <h1 className="text-4xl font-bold mb-4">
              Join Budget Tracker Today!
            </h1>
            <p className="text-lg">
              Take control of your finances and start reaching your financial goals.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4">
              <div className="bg-gradient-to-r from-green-600 to-black bg-opacity-20 p-4 rounded-lg border">
                <i className="fa-solid fa-chart-line text-3xl mb-2"></i>
                <h3 className="font-bold">Track Expenses</h3>
                <p className="text-sm">Monitor where your money goes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (Signup Form) */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
          <div className="w-full max-w-md px-4">
            <form
              onSubmit={handleSignup}
              className="bg-white p-6 rounded-xl shadow-xl"
            >
              {/* Budget Icon Header */}
              <div className="flex justify-center mb-4">
                <img
                  src="/budget_signup.jpeg"
                  alt="Signup Logo"
                  className="h-20 w-20 rounded-full"
                />
              </div>

              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Create New Account
              </h2>

              <div className="mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-circle-user"></i>
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="mb-4 relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-unlock-keyhole"></i>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div className="mb-4 relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-lock"></i>
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {errors.general && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mb-4">
                  <p className="text-red-500 text-sm">{errors.general}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r hover:rounded-full from-green-600 to-green-700 text-white py-2 rounded-lg hover:from-green-700 hover:to-green-800"
              >
                Create Account
              </button>

              <p className="mt-4 text-center text-gray-700">
                Already have an account?{" "}
                <span
                  className="text-green-600 cursor-pointer hover:text-green-700 font-medium underline"
                  onClick={() => navigate("/")}
                >
                  Login
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
