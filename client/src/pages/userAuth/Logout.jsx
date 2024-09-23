import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logoutUser, setUser } from "../../redux/authSlice.js";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
        const response = await axios.get('/api/v1/users/user/logout');
        
        if (response.data.success) {
            // Clear user from Redux
            dispatch(logoutUser()); // Make sure to use the correct action to clear user data
            localStorage.removeItem('user');
            localStorage.removeItem('token');

            // Redirect to login page
            navigate('/login');
        } else {
            console.error('Logout was not successful:', response.data.message);
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
