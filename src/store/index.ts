import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userStore";
import authReducer from "./authSlice";
import menuReducer from "./menuSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    menu: menuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;




