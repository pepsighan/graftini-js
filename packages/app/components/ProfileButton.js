import { Box, Divider, IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import { PersonIcon } from '@modulz/radix-icons';
import { useCallback, useState } from 'react';
import { logout, useAuthUser } from 'store/auth';

export default function ProfileButton() {
  const { user } = useAuthUser();

  const [el, setEl] = useState(null);

  const onClick = useCallback((event) => {
    setEl(event.currentTarget);
  }, []);
  const onClose = useCallback(() => {
    setEl(null);
  }, []);

  return (
    <>
      <IconButton onClick={onClick} color="inherit">
        <PersonIcon width={18} height={18} />
      </IconButton>

      <Menu
        anchorEl={el}
        open={!!el}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPaper-root': {
            mt: 0.5,
            width: 180,
          },
          '& .MuiMenuItem-root': {
            cursor: 'pointer',
          },
        }}
      >
        <Box component="li" sx={{ px: 2, py: 1 }}>
          <Typography variant="body2" color="textSecondary">
            You are logged in as:
          </Typography>
          <Typography variant="body2">{user.email}</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </>
  );
}
