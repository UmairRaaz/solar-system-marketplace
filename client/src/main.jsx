import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { Route, RouterProvider, createRoutesFromElements, createBrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import Store from './redux/store.js';

import Register from './pages/userAuth/Register.jsx';
import Login from './pages/userAuth/Login.jsx';
import AdminRegister from './pages/adminAuth/AdminRegister.jsx';
import AdminLogin from './pages/adminAuth/AdminLogin.jsx';
import Home from './pages/user/Home.jsx';
import UserProfile from './pages/user/UserProfile.jsx';

import ProtectedRoute from './pages/seller-dashobard/ProtectedRoute.jsx';
import AddProduct from './pages/seller-dashobard/AddProduct.jsx';
import ViewProducts from './pages/seller-dashobard/ViewProducts.jsx';
import SellerDashboard from './pages/seller-dashobard/SellerDashboard.jsx';
import AllForums from './pages/forums/AllForums.jsx';
import UserPosts from './pages/user/UserPosts.jsx';
import EditProduct from './pages/seller-dashobard/EditProduct.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/' element={<Home />} />
      <Route path='/home' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/userprofile' element={<UserProfile />} />

      {/* Admin Routes */}
      <Route path='/admin/register' element={<AdminRegister />} />
      <Route path='/admin/login' element={<AdminLogin />} />

      {/* Seller Dashboard Routes */}
      <Route path='/seller/dashboard' element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>}>
        <Route path='add-product' element={<AddProduct />} />
        <Route path='view-products' element={<ViewProducts />} />
        <Route path='view-all-posts' element={<UserPosts />} />
        <Route path="product/:productId" element={<EditProduct />} />

      </Route>

      <Route path='/all-forums' element={<AllForums />} />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={Store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
