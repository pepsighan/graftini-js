import { rgbaToCss } from '@graftini/bricks';
import { Box } from '@material-ui/core';
import { TransparencyGridIcon } from '@modulz/radix-icons';

/**
 * Shows a preview of the color that is selected with a chessboard in the background if
 * there is transparency.
 */
export default function ColorBox({ value }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 16,
        height: 16,
        borderRadius: 1,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'grey.400',
      }}
    >
      <TransparencyGridIcon width="100%" height="100%" />
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: value ? rgbaToCss(value) : null,
        }}
      />
    </Box>
  );
}
