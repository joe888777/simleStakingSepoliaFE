import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../../api/userApi';
import { setUsers } from '../../../store/userStore';
import { RootState, AppDispatch } from '../../../store';
import Button from '../../components/Button';

const ManageUsersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.user.users);

  const fetchUsers = async () => {
    try {
      const usersData = await getUsers();
      dispatch(setUsers(usersData));
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          {user.username} - {user.role}
        </div>
      ))}
      <Button text="Refresh" onClick={fetchUsers} />
    </div>
  );
};

export default ManageUsersPage;



