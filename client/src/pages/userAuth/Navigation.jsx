import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../redux/authSlice';
import axios from 'axios';
import LogoutButton from './Logout';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
 
  const handleProfile = () => {
    setLogoutOpen(false);
    navigate('/userprofile');
  };


  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center  justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex-1 flex  items-center  sm:items-stretch sm:justify-start md:justify-between">
            <div className="flex-shrink-0 flex items-center justify-center">
              <h1 className="text-white text-xl  font-bold">MyApp</h1>
            </div>

            <div className="hidden sm:block  sm:ml-6">
              <div className="flex space-x-4 items-center">
                <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link to="/seller/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/all-forums" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Forums
                </Link>
            

                {user ? (
                  <div className="relative  flex gap-2 items-center">
                    <div
                      onClick={() => setLogoutOpen(!logoutOpen)}
                      className="w-10 h-10 cursor-pointer border rounded-full bg-white border-gray-500 flex justify-center items-center"
                    >
                      <span className="text-gray-700">{user?.userName?.charAt(0).toUpperCase()}</span>
                    </div>

                    {logoutOpen && (
                      <div className="absolute top-14 w-32 -left-20 flex flex-col gap-2 bg-white text-gray-700 p-2 rounded-lg shadow-lg">
                        <button onClick={handleProfile} className="hover:bg-gray-200 p-2 rounded">
                          View Profile
                        </button>
                        <LogoutButton/>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      Login
                    </Link>
                    <Link to="/register" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
