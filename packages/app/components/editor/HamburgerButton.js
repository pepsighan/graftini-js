import { Badge, IconButton, Menu, MenuItem } from '@material-ui/core';
import { HamburgerMenuIcon } from '@modulz/radix-icons';
import { useCallback, useState } from 'react';
import { useLocalStorage } from 'react-use';

export default function HamburgerButton() {
  const [open, setOpen] = useState(null);
  const [value, setValue] = useLocalStorage('graftini-project-settings-viewed', 'false');

  const onOpen = useCallback(
    (event) => {
      setValue('true');
      setOpen(event.currentTarget);
    },
    [setValue]
  );
  const onClose = useCallback(() => setOpen(null), []);

  return (
    <>
      <IconButton onClick={onOpen}>
        <Badge variant="dot" color="info" invisible={value === 'true'}>
          <HamburgerMenuIcon />
        </Badge>
      </IconButton>

      <Menu open={!!open} onClose={onClose} anchorEl={open}>
        <MenuItem>Keyboard Shortcuts</MenuItem>
        <MenuItem>Changelog</MenuItem>
      </Menu>
    </>
  );
}
