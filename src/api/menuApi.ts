import api from "./axiosInstance";
import { MenuItem } from "../models/MenuModel";

export const getMenu = async (): Promise<MenuItem[]> => {
  const res = await api.post("/Menuhierachy/menus", {"userID": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "roleID": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "platform": "frontendweb"}); 
  console.log(res.data);
  return res.data;
};



