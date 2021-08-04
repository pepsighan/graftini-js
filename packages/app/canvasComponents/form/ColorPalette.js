import { Box, Button, Grid, Tooltip, Typography } from '@material-ui/core';
import { TransparencyGridIcon } from '@modulz/radix-icons';
import useGetPalette from 'hooks/useGetPalette';
import { useCallback } from 'react';
import { rgbaToViewableLabel } from 'utils/color';
import { rgbaToCss } from '@graftini/bricks';

// Any color with a=0 is a transparent color.
const transparentColor = { r: 255, g: 255, b: 255, a: 0 };

export default function ColorPalette({ onChange }) {
  const colors = useGetPalette();

  return (
    <>
      <Typography variant="caption" color="textSecondary">
        Palette
      </Typography>

      <Grid container sx={{ pt: 0.25 }} spacing={1}>
        <ColorButton color={transparentColor} onClick={onChange}>
          <TransparencyGridIcon width="100%" height="100%" />
        </ColorButton>
        {colors
          .filter((it) => it.a !== 0)
          .map((it, index) => (
            <ColorButton key={index} color={it} onClick={onChange}>
              <TransparencyGridIcon width="100%" height="100%" />
            </ColorButton>
          ))}
      </Grid>
    </>
  );
}

function ColorButton({ color, onClick, children }) {
  const onColor = useCallback(() => onClick(color), [color, onClick]);

  return (
    <Grid item>
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
          {color.a !== 0 && (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: rgbaToCss(color),
              }}
            />
          )}
        </Button>
      </Tooltip>
    </Grid>
  );
}
