import { Badge, Box, IconButton, Popover, Stack, Tooltip, Typography } from '@material-ui/core';
import { MixIcon } from '@modulz/radix-icons';
import { useCallback, useState } from 'react';
import { isMacOs } from 'react-device-detect';
import { useLocalStorage } from 'react-use';

const CtrlKey = isMacOs ? '⌘' : 'Ctrl';

export default function ShortcutsButton() {
  const [open, setOpen] = useState(null);
  const [value, setValue] = useLocalStorage('graftini-shortcut-viewed', 'false');

  const onOpen = useCallback(
    (event) => {
      setOpen(event.currentTarget);
      setValue('true');
    },
    [setValue]
  );
  const onClose = useCallback(() => setOpen(null), []);

  return (
    <>
      <Tooltip title="Shortcuts">
        <IconButton onClick={onOpen}>
          <Badge variant="dot" color="info" invisible={value === 'true'}>
            <MixIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Box sx={{ px: 2, pt: 1, pb: 1.5, width: 300 }}>
          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
            Shortcuts
          </Typography>

          <Stack spacing={1}>
            <ShortcutKey shortcut={`Mouse Resize`} meaning="Resizes in px unit" />
            <ShortcutKey shortcut={`${CtrlKey} + Mouse Resize`} meaning="Resizes in % unit" />
          </Stack>
        </Box>
      </Popover>
    </>
  );
}

function ShortcutKey({ shortcut, meaning }) {
  return (
    <Stack direction="row" spacing={1}>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          sx={{ bgcolor: 'grey.300', px: 1, borderRadius: 0.5 }}
        >
          {shortcut}
        </Typography>
      </Box>
      <Typography variant="subtitle2" color="textSecondary" sx={{ flex: 1 }}>
        {meaning}
      </Typography>
    </Stack>
  );
}