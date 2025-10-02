import { AppDispatch } from "../store";
import { getMenu } from "../api/userApi";
import { setMenu, clearMenu } from "../store/menuSlice";

export const fetchMenu = () => async (dispatch: AppDispatch) => {
  const data = await getMenu();
  dispatch(setMenu(data));
};

export const clearMenuData = () => (dispatch: AppDispatch) => {
  dispatch(clearMenu());
};