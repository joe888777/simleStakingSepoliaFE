import api from "./axiosInstance";
import { MenuItem } from "../models/MenuModel";
import { User } from "../models/UserModel";

export const login = async (username: string, password: string) => {
  const res = await api.post("/auth/login", { username, password });
  return res.data; 
};

export const getMenu = async (): Promise<MenuItem[]> => {
  const res = await api.get("/Menuhierachy/menus");
  return res.data;
};
export const getUsers = async (): Promise<User[]> => {
  const res = await api.get("/users"); 
  return res.data;
};


