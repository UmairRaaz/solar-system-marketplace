import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null, 
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        logoutUser: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        }
    }
});

export const { setLoading, setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
