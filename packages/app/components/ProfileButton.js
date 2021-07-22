import { Avatar } from '@material-ui/core';
import { PersonIcon } from '@modulz/radix-icons';

export default function ProfileButton() {
  return (
    <Avatar sx={{ width: 32, height: 32 }}>
      <PersonIcon />
    </Avatar>
  );
}
