import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminRegister = () => {
    // State to hold form data
    const [formData, setFormData] = useState({
        adminSecretKey: '',
        userName: '',
        email: '',
        fullName: '',
        password: '',
    });

    useEffect( () => {
        const user = JSON.parse(localStorage.getItem('user'))
        if(user){
            navigate('/home')
        }
        // console.log(user)
    },[] )

    // State for handling response or errors
    const [responseMessage, setResponseMessage] = useState('');
    const [error, setError] = useState('');

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/v1/users/admin/register', formData); 
            setResponseMessage(response.data.message);
            setError(''); // Clear any previous error

        } catch (err) {
            setError(err.response ? err.response.data.message : 'Something went wrong');
            setResponseMessage('');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Admin Registration</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Admin Secret Key Input */}
                    <div>
                        <label htmlFor="adminSecretKey" className="block text-sm font-medium text-gray-700">Admin Secret Key</label>
                        <input
                            type="password"
                            name="adminSecretKey"
                            id="adminSecretKey"
                            value={formData.adminSecretKey}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter Admin Secret Key"
                            required
                        />
                    </div>

                    {/* Username Input */}
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Username</label>
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

                    {/* Full Name Input */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            id="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

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

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Register
                        </button>
                    </div>

                    {/* Response Message */}
                    {responseMessage && <p className="text-green-500 mt-2">{responseMessage}</p>}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default AdminRegister;
