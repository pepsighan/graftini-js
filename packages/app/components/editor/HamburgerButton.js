import { Badge, IconButton, Menu, MenuItem } from '@material-ui/core';
import { HamburgerMenuIcon } from '@modulz/radix-icons';
import useBoolean from 'hooks/useBoolean';
import { useCallback, useState } from 'react';
import { useLocalStorage } from 'react-use';
import ShortcutsDialog from './ShortcutsDialog';

export default function HamburgerButton() {
  const [open, setOpen] = useState(null);
  const [value, setValue] = useLocalStorage('graftini-project-settings-viewed', 'false');

  const [isShortcutsOpen, { on: onShortcuts, off: onShortcutsClose }] = useBoolean(false);

  const onOpen = useCallback(
    (event) => {
      setValue('true');
      setOpen(event.currentTarget);
    },
    [setValue]
  );
  const onClose = useCallback(() => setOpen(null), []);

  const onCloseWrap = useCallback(
    (fn) => () => {
      onClose();
      fn();
    },
    [onClose]
  );

  return (
    <>
      <IconButton onClick={onOpen}>
        <Badge variant="dot" color="info" invisible={value === 'true'}>
          <HamburgerMenuIcon />
        </Badge>
      </IconButton>

      <Menu open={!!open} onClose={onClose} anchorEl={open}>
        <MenuItem onClick={onCloseWrap(onShortcuts)}>Keyboard Shortcuts</MenuItem>
        <MenuItem>Changelog</MenuItem>
      </Menu>

      <ShortcutsDialog open={isShortcutsOpen} onClose={onShortcutsClose} />
    </>
  );
}
