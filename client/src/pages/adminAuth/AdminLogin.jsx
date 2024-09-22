import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Link, useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setUser } from "../../redux/authSlice.js"

const AdminLogin = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect( () => {
        const user = JSON.parse(localStorage.getItem('user'))
        if(user){
            navigate('/home')
        }
        // console.log(user)
    },[] )

    // State to hold form data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    // State for handling response or errors
    const [responseMessage, setResponseMessage] = useState('');
    const [error, setError] = useState('');

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

        if(formData.password !== formData.confirmPassword){
            setError("Both Passwords are different")
            return
        }
        try {
            // Send login request to the server
            const response = await axios.post('/api/v1/users/admin/login', formData);
            console.log("Response", response);
    
            // if (response.data.success) {
            //     console.log('hi')
            //     dispatch(setUser(response.data.data.user)); 
            //     setResponseMessage("Login successful! Redirecting...");
            //     setError(""); 
            //     navigate('/home');
            //     localStorage.setItem("userInfo", JSON.stringify(response.data.data.user))
            // }
            if (response.data.success) {
                const userData = response.data.data.user;
                const token = response.data.data.accessToken; 

                // Save user to Redux
                dispatch(setUser(userData)); 

                // Save user data and token to localStorage
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('token', token);

                setResponseMessage("Login successful! Redirecting...");
                setError("");

                // Redirect to the home page
                navigate('/home');
            }
        } catch (err) {
            if (err.response) {
                const status = err.response.status;
                const message = err.response.data.message;
    
                if (status === 404) {
                    setError("Email not found. Please check your email.");
                } else if (status === 401) {
                    setError("Incorrect password. Please try again.");
                } else if (status === 403) {
                    setError("Access denied. Invalid role.");
                } else {
                    setError(message || "Something went wrong. Please try again.");
                }
            } else {
                setError("Network error or server is down. Please try again later.");
            }
    
            setResponseMessage('');
        }
    };
    
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Admin Login</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
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
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Confirm Password"
                            required
                        />
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
                        <span>Don't have an account! <Link to='/admin/register' className='text-blue-800'>Sign Up</Link></span>
                    </div>

                    {/* Response Message */}
                    {responseMessage && <p className="text-green-500 mt-2">{responseMessage}</p>}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;