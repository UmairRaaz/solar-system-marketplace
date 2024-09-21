import './App.css'
import { Outlet } from 'react-router-dom'
import Navigation from './pages/userAuth/Navigation'

import { useSelector } from 'react-redux'

function App() {

  const user = useSelector(state => state.user)

  return (
    <>
    <Navigation />
     <main>
      <Outlet />
     </main>
    </>
  )
}

export default App
