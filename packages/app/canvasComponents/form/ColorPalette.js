import { Box, Button, Tooltip, Typography } from '@material-ui/core';
import { TransparencyGridIcon } from '@modulz/radix-icons';
import { useCallback } from 'react';
import { rgbaToViewableLabel } from 'utils/color';

// Any color with a=0 is a transparent color.
const transparentColor = { r: 255, g: 255, b: 255, a: 0 };

export default function ColorPalette({ onChange }) {
  return (
    <>
      <Typography variant="caption" color="textSecondary">
        Palette
      </Typography>

      <Box sx={{ mt: 0.25 }}>
        <ColorButton color={transparentColor} onClick={onChange}>
          <TransparencyGridIcon width="100%" height="100%" />
        </ColorButton>
      </Box>
    </>
  );
}

function ColorButton({ color, onClick, children }) {
  const onColor = useCallback(() => onClick(color), [color, onClick]);

  return (
    <Tooltip title={rgbaToViewableLabel(color)}>
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
