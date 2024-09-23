import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/authSlice.js";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/home");
    }
    console.log(user);
  }, []);

  const handleNavigate = () => {
    navigate("/register");
  };

  // State to hold form data
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "user", // Default role
  });

  // State for handling response or errors
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");

  // Handle input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("/api/v1/users/login", formData);

        if (response?.data?.success) {
            const userData = response.data.data.user;
            const token = response.data?.data.accessToken;

            if (!token) {
                setError("Token is missing.");
                return;
            }

            // Save user to Redux
            dispatch(setUser({ userData, token }));

            // Save user data and token to localStorage as a single object
            const userWithToken = { ...userData, token };
            localStorage.setItem("user", JSON.stringify(userWithToken));

            setResponseMessage("Login successful! Redirecting...");
            setError("");

            navigate("/home");
        } else {
            setError("No user found in the response.");
        }
    } catch (err) {
        // Error handling remains unchanged
    }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
          User Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="userName"
              id="userName"
              value={formData.userName}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="user">User</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>

          <div>
            <span>Don't have an account?</span>{" "}
            <button onClick={handleNavigate} className="text-blue-700">
              Sign In
            </button>
          </div>
          {/* Response Message */}
          {responseMessage && (
            <p className="text-green-500 mt-2">{responseMessage}</p>
          )}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
