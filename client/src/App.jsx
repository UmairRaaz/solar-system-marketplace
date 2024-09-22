import './App.css';
import { Outlet } from 'react-router-dom';
import Navigation from './pages/userAuth/Navigation';

import { useSelector } from 'react-redux';
import { setUser } from './redux/authSlice';
import store from './redux/store';  

function App() {

  const user = useSelector(state => state.auth.user);  
  const userFromStorage = localStorage.getItem('user');
  if (userFromStorage && !user) {  
    store.dispatch(setUser(JSON.parse(userFromStorage)));
  }

  return (
    <>
      <Navigation />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
