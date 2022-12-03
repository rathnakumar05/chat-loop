import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    'session_id': localStorage.getItem("session_id") ?? "",
    'auth': localStorage.getItem("auth") ?? "N",
    'username': localStorage.getItem("username") ?? "",
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setSession: (state, action) => {
            state.session_id = action.payload.session_id;
            state.auth = action.payload.auth;
            state.username = action.payload.username;
        }
    }
});

export const authState = (state) => state.auth;

export const { setSession } = authSlice.actions;

export default authSlice.reducer;



