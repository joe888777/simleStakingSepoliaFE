import { getUsers } from '../api/userApi';
import { setUsers } from '../store/userStore';
import type { AppDispatch } from '../store'; 

export const fetchUsers = async (dispatch: AppDispatch) => {
  try {
    const users = await getUsers();
    dispatch(setUsers(users));
  } catch (error) {
    console.error('Error fetching users', error);
  }
};



