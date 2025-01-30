import { FC, MouseEventHandler, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Menu, MenuItem } from '@mui/material';

import { User } from '../../../types';
import { useAppDispatch } from '../../../app/hooks';
import { logout } from '../../../features/users/usersThunk';

interface Props {
  user: User;
}

const UserMenu: FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);

  const ref = useRef(null);

  const closeAndNavigate = (url: string) => {
    setOpen(false);
    navigate(url);
  };

  const handleClick: MouseEventHandler = async () => {
    setOpen(false);
    await dispatch(logout());
  };

  return (
    <>
      <Button ref={ref} onClick={() => setOpen(true)} color='inherit'>
        {user.username}
      </Button>
      <Menu anchorEl={ref.current} open={open} onClose={() => setOpen(false)}>
        {user.role === 'admin' && <MenuItem onClick={() => closeAndNavigate('/admin')}>Admin page</MenuItem>}
        <MenuItem onClick={() => closeAndNavigate('/artist/new')}>Add new artist</MenuItem>
        <MenuItem onClick={() => closeAndNavigate('/album/new')}>Add new album</MenuItem>
        <MenuItem onClick={() => closeAndNavigate('/track/new')}>Add new track</MenuItem>
        <MenuItem onClick={() => closeAndNavigate('/track_history')}>Track history</MenuItem>
        <MenuItem onClick={handleClick}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
