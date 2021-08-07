import { Badge, Button, IconButton, Menu, MenuItem } from '@material-ui/core';
import { HamburgerMenuIcon } from '@modulz/radix-icons';
import useBoolean from 'hooks/useBoolean';
import { useCallback, useRef, useState } from 'react';
import { useLocalStorage } from 'react-use';
import ChangelogDialog, { version } from './ChangelogDialog';
import ShortcutsDialog from './ShortcutsDialog';
import { FeedbackFish } from '@feedback-fish/react';

export default function HamburgerButton() {
  const feedbackRef = useRef(null);

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

  const onFeedbackOpen = useCallback(() => {
    if (feedbackRef.current) {
      feedbackRef.current.click();
    }
    onClose();
  }, [onClose]);

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
        <MenuItem onClick={onShortcutOpen} sx={{ cursor: 'pointer' }}>
          <Badge variant="dot" color="info" invisible={shortcutsViewed === 'true'}>
            Keyboard Shortcuts
          </Badge>
        </MenuItem>
        <MenuItem onClick={onChangelogOpen} sx={{ cursor: 'pointer' }}>
          <Badge variant="dot" color="info" invisible={changelogViewed === version}>
            Changelog
          </Badge>
        </MenuItem>
        <MenuItem onClick={onFeedbackOpen} sx={{ cursor: 'pointer' }}>
          Give us Feedback
        </MenuItem>
      </Menu>

      <ShortcutsDialog open={isShortcutsOpen} onClose={onShortcutsClose} />
      <ChangelogDialog open={isChangelogOpen} onClose={onChangelogClose} />

      {/* Feedback fish provides an API component which when clicked will open the feedback UI.
      But since our UI is a menu, we are delegating the click to the wrapped button. */}
      <FeedbackFish projectId="0cfacd08fe9961">
        <Button
          ref={feedbackRef}
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            pointerEvents: 'none',
            opacity: 0,
          }}
        >
          Give us Feedback
        </Button>
      </FeedbackFish>
    </>
  );
}
