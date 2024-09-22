import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUser } from "../../redux/authSlice.js";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      // Send logout request to the server
      const response = await axios.get('/api/v1/users/user/logout');

      if (response.data.success) {
        // Clear user from Redux
        dispatch(setUser(null));

        // Remove user and token from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        // Redirect to login page
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>

  );
};

export default Navbar;
