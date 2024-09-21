import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    role: '',
    userName: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace with your backend API endpoint
    axios.get('/api/v1/users/user')
      .then((response) => {
        setUser(response.data.data);
        console.log("setUser", setUser)
        // console.log("response.data", response.data.data)
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch user data', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">User Profile</h1>
      <div className="mb-4">
        <label className="block text-gray-600 text-sm font-medium">Full Name</label>
        <p className="text-lg text-gray-900">{user.fullName}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 text-sm font-medium">Email</label>
        <p className="text-lg text-gray-900">{user.email}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 text-sm font-medium">Role</label>
        <p className="text-lg text-gray-900">{user.role}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 text-sm font-medium">Username</label>
        <p className="text-lg text-gray-900">{user.userName}</p>
      </div>
    </div>
  );
};

export default UserProfile;
