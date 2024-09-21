import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { Route, RouterProvider, createRoutesFromElements, createBrowserRouter } from 'react-router-dom';

import { Provider } from "react-redux";
import Store  from "./redux/store.js"

import Register from './pages/userAuth/Register.jsx'
import Login from './pages/userAuth/Login.jsx';
import AdminRegister from './pages/adminAuth/AdminRegister.jsx';
import Home from './pages/user/Home.jsx';
import UserProfile from './pages/user/UserProfile.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/home' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/userProfile' element={<UserProfile />} />

      {/* <Route path='' element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
      </Route> */}

      <Route path='/admin/register' element={<AdminRegister />} />
      {/* <Route path='/admin' element={<AdminRoute />} >
           <Route path='/admin/userlist' element={<UsersList />}/>
      </Route> */}
    </Route>
  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={Store}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
