import { AppDispatch } from "../store";
import { setAuth, clearAuth } from "../store/authSlice";
import { setAuthToken, clearAuthToken } from "../api/axiosInstance";
import { login } from "../api/userApi";

export const loginUser = (username: string, password: string) => async (dispatch: AppDispatch) => {
  const data = await login(username, password);
  setAuthToken(data.token);
  dispatch(setAuth({ token: data.token, user: data.user }));
};

export const logoutUser = () => (dispatch: AppDispatch) => {
  clearAuthToken();
  dispatch(clearAuth());
};



