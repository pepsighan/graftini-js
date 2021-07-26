import { Box, IconButton, Popover, Stack, Typography } from '@material-ui/core';
import { MixIcon } from '@modulz/radix-icons';
import { useCallback, useState } from 'react';
import { isMacOs } from 'react-device-detect';

const CtrlKey = isMacOs ? '⌘' : 'Ctrl';

export default function ShortcutsButton() {
  const [open, setOpen] = useState(null);

  const onOpen = useCallback((event) => setOpen(event.currentTarget), []);
  const onClose = useCallback(() => setOpen(null), []);

  return (
    <>
      <IconButton onClick={onOpen}>
        <MixIcon />
      </IconButton>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Box sx={{ px: 2, pt: 1, pb: 1.5, width: 280 }}>
          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
            Shortcuts
          </Typography>

          <Stack direction="row">
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ bgcolor: 'grey.300', px: 1, borderRadius: 0.5, mr: 1 }}
            >
              {CtrlKey} + Mouse Resize
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Resizes in %
            </Typography>
          </Stack>
        </Box>
      </Popover>
    </>
  );
}
