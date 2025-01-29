import { FC, useRef, useState } from 'react';
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
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button ref={ref} onClick={() => setOpen(true)} color='inherit'>
        {user.username}
      </Button>
      <Menu anchorEl={ref.current} open={open} onClose={() => setOpen(false)}>
        <MenuItem onClick={() => navigate('/track_history')}>Track history</MenuItem>
        <MenuItem onClick={async () => await dispatch(logout())}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
