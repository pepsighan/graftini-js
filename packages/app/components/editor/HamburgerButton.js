import { Badge, IconButton, Menu, MenuItem } from '@material-ui/core';
import { HamburgerMenuIcon } from '@modulz/radix-icons';
import useBoolean from 'hooks/useBoolean';
import { useCallback, useState } from 'react';
import { useLocalStorage } from 'react-use';
import ChangelogDialog, { version } from './ChangelogDialog';
import ShortcutsDialog from './ShortcutsDialog';

export default function HamburgerButton() {
  const [open, setOpen] = useState(null);
  const [shortcutsViewed, setShortcutsViewed] = useLocalStorage(
    'graftini-shortcut-viewed',
    'false'
  );
  const [changelogViewed, setChangelogViewed] = useLocalStorage('graftini-changelog-viewed-v');

  const [isShortcutsOpen, { on: onShortcuts, off: onShortcutsClose }] = useBoolean(false);
  const [isChangelogOpen, { on: onChangelog, off: onChangelogClose }] = useBoolean(false);

  const onOpen = useCallback((event) => {
    setOpen(event.currentTarget);
  }, []);
  const onClose = useCallback(() => setOpen(null), []);

  const onShortcutOpen = useCallback(() => {
    setShortcutsViewed('true');
    onClose();
    onShortcuts();
  }, [onClose, onShortcuts, setShortcutsViewed]);

  const onChangelogOpen = useCallback(() => {
    setChangelogViewed(version);
    onClose();
    onChangelog();
  }, [onChangelog, onClose, setChangelogViewed]);

  return (
    <>
      <IconButton onClick={onOpen}>
        <Badge
          variant="dot"
          color="info"
          invisible={shortcutsViewed === 'true' && changelogViewed === version}
        >
          <HamburgerMenuIcon />
        </Badge>
      </IconButton>

      <Menu open={!!open} onClose={onClose} anchorEl={open}>
        <MenuItem onClick={onShortcutOpen}>
          <Badge variant="dot" color="info" invisible={shortcutsViewed === 'true'}>
            Keyboard Shortcuts
          </Badge>
        </MenuItem>
        <MenuItem onClick={onChangelogOpen}>
          <Badge variant="dot" color="info" invisible={changelogViewed === version}>
            Changelog
          </Badge>
        </MenuItem>
      </Menu>

      <ShortcutsDialog open={isShortcutsOpen} onClose={onShortcutsClose} />
      <ChangelogDialog open={isChangelogOpen} onClose={onChangelogClose} />
    </>
  );
}
