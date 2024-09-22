import './App.css';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './pages/userAuth/Navigation';

import { useSelector } from 'react-redux';
import { setUser } from './redux/authSlice';
import store from './redux/store';  

function App() {

  const location = useLocation()
  const hideNavRoutes = ['/login', '/register', '/admin/login', '/admin/register'];

  const user = useSelector(state => state.auth.user);  
  const userFromStorage = localStorage.getItem('user');
  if (userFromStorage && !user) {  
    store.dispatch(setUser(JSON.parse(userFromStorage)));
  }

  return (
    <>
     {!hideNavRoutes.includes(location.pathname) && <Navigation />}

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
