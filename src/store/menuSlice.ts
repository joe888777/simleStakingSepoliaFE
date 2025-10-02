import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MenuItem } from "../models/MenuModel";

interface MenuState {
  items: MenuItem[];
}

const initialState: MenuState = { items: [] };

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenu: (state, action: PayloadAction<MenuItem[]>) => {
      state.items = action.payload;
    },
    clearMenu: (state) => {
      state.items = [];
    },
  },
});

export const { setMenu, clearMenu } = menuSlice.actions;
export default menuSlice.reducer;



