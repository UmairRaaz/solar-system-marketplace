import "./App.css";
import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./pages/userAuth/Navigation";
import { useSelector } from "react-redux";
import { setUser, logoutUser } from "./redux/authSlice";
import store from "./redux/store";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode without destructuring
import { useCallback, useEffect } from "react";

function App() {
  const location = useLocation();
  const hideNavRoutes = [
    "/login",
    "/register",
    "/admin/login",
    "/admin/register",
  ];

  const user = useSelector((state) => state.auth.user);
  const userFromStorage = localStorage.getItem("token");
  console.log(userFromStorage);

  if (userFromStorage && !user) {
    store.dispatch(setUser({ token: userFromStorage }));
  }

  // Function to check token expiration
  const checkTokenExpiration = useCallback(() => {
    if (userFromStorage) {
      try {
        const decodedToken = jwtDecode(userFromStorage);

        // Convert expiration time from seconds to milliseconds
        const expireTimeInMilliseconds = decodedToken.exp * 1000;

        // Create a Date object
        const expireDate = new Date(expireTimeInMilliseconds);

        console.log("Expire Time (in milliseconds):", expireTimeInMilliseconds);
        console.log(
          "Expire Time (human-readable):",
          expireDate.toLocaleString()
        ); // Outputs
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          store.dispatch(logoutUser()); // Log out if token has expired
        }
      } catch (error) {
        console.error("Failed to decode token:", error.message);
        store.dispatch(logoutUser()); // Log out in case of decoding error
      }
    }
  }, [userFromStorage]);

  useEffect(() => {
    // Check token expiration on component mount
    checkTokenExpiration();

    // Optionally, set a timer to periodically check token expiration
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, [userFromStorage, checkTokenExpiration]);

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
