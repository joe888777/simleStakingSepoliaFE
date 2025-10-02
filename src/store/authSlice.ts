import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../models/UserModel";

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("authToken"),
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("authToken", action.payload.token);
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("authToken");
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;



