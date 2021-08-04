import { Box, Button, Tooltip, Typography } from '@material-ui/core';
import { TransparencyGridIcon } from '@modulz/radix-icons';
import { useCallback } from 'react';

export default function ColorPalette({ onChange }) {
  return (
    <>
      <Typography variant="caption" color="textSecondary">
        Palette
      </Typography>

      <Box sx={{ mt: 0.25 }}>
        <ColorButton color="transparent" onClick={onChange}>
          <TransparencyGridIcon width="100%" height="100%" />
        </ColorButton>
      </Box>
    </>
  );
}

function ColorButton({ color, onClick, children }) {
  const onColor = useCallback(() => onClick(color), [color, onClick]);

  return (
    <Tooltip title={color}>
      <Button
        sx={{
          position: 'relative',
          width: 24,
          height: 24,
          borderRadius: 1,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'grey.400',
          p: 0,
          minWidth: 0,
        }}
        onClick={onColor}
      >
        {children}
      </Button>
    </Tooltip>
  );
}
