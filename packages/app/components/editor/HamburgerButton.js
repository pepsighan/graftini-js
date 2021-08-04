import { Badge, IconButton, Menu, MenuItem } from '@material-ui/core';
import { HamburgerMenuIcon } from '@modulz/radix-icons';
import useBoolean from 'hooks/useBoolean';
import { useCallback, useState } from 'react';
import { useLocalStorage } from 'react-use';
import ShortcutsDialog from './ShortcutsDialog';

export default function HamburgerButton() {
  const [open, setOpen] = useState(null);
  const [shortcutsViewed, setShortcutsViewed] = useLocalStorage(
    'graftini-shortcut-viewed',
    'false'
  );

  const [isShortcutsOpen, { on: onShortcuts, off: onShortcutsClose }] = useBoolean(false);

  const onOpen = useCallback((event) => {
    setOpen(event.currentTarget);
  }, []);
  const onClose = useCallback(() => setOpen(null), []);

  const onShortcutOpen = useCallback(() => {
    setShortcutsViewed('true');
    onClose();
    onShortcuts();
  }, [onClose, onShortcuts, setShortcutsViewed]);

  return (
    <>
      <IconButton onClick={onOpen}>
        <Badge variant="dot" color="info" invisible={shortcutsViewed === 'true'}>
          <HamburgerMenuIcon />
        </Badge>
      </IconButton>

      <Menu open={!!open} onClose={onClose} anchorEl={open}>
        <MenuItem onClick={onShortcutOpen}>
          <Badge variant="dot" color="info" invisible={shortcutsViewed === 'true'}>
            Keyboard Shortcuts
          </Badge>
        </MenuItem>
        <MenuItem>Changelog</MenuItem>
      </Menu>

      <ShortcutsDialog open={isShortcutsOpen} onClose={onShortcutsClose} />
    </>
  );
}
