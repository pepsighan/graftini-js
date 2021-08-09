import { Box, Button, Grid, Tooltip, Typography } from '@material-ui/core';
import { TransparencyGridIcon } from '@modulz/radix-icons';
import useGetPalette from 'hooks/useGetPalette';
import { useCallback } from 'react';
import { rgbaToViewableLabel } from 'utils/color';
import { rgbaToCss } from '@graftini/bricks';

// Any color with a=0 is a transparent color.
const transparentColor = { r: 255, g: 255, b: 255, a: 0 };
const blackColor = { r: 0, g: 0, b: 0 };

export default function ColorPalette({ onChange }) {
  // Get the palette used in the page skipping transparent or black color. We have these two
  // colors by default.
  const colors = useGetPalette(
    useCallback((color) => {
      if (color.a === 0) {
        return false;
      }

      if (color.r === 0 && color.g === 0 && color.b === 0 && (color.a === null || color.a === 1)) {
        return false;
      }

      return true;
    }, [])
  );

  return (
    <>
      <Typography variant="caption" color="textSecondary">
        Palette
      </Typography>

      <Grid container sx={{ pt: 0.25 }} spacing={0.85}>
        <ColorButton color={transparentColor} onClick={onChange}>
          <TransparencyGridIcon width="100%" height="100%" />
        </ColorButton>
        <ColorButton color={blackColor} onClick={onChange}>
          <TransparencyGridIcon width="100%" height="100%" />
        </ColorButton>
        {colors.map((it, index) => (
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
