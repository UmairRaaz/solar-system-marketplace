import { jwtDecode } from "jwt-decode";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            const { userData, token } = action.payload;

            if (token) {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    state.user = null;
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                } else {
                    state.user = { ...userData, token }; // Save user data and token together
                    localStorage.setItem('user', JSON.stringify(state.user)); // Save combined object
                    localStorage.setItem('token', token); // Optional: if you want to keep it separate
                }
            }
        },
        logoutUser: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }
});


export const { setLoading, setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
