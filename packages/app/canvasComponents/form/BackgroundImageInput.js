import { Box, InputAdornment, TextField, Typography } from '@material-ui/core';
import { wideLabelAlignmentStyle } from './formLabels';

export default function BackgroundImageInput() {
  const imageUrl = null;

  return (
    <TextField
      placeholder="Add"
      InputProps={{
        readOnly: true,
        startAdornment: (
          <InputAdornment position="start" sx={wideLabelAlignmentStyle}>
            <Typography variant="body2">Image</Typography>
          </InputAdornment>
        ),
        endAdornment: imageUrl ? (
          <InputAdornment position="end">
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: 'grey.200',
                borderRadius: 1,
                backgroundImage: `url(${imageUrl})`,
              }}
            />
          </InputAdornment>
        ) : null,
      }}
      sx={{
        '& .MuiOutlinedInput-root, & .MuiOutlinedInput-input': {
          cursor: 'pointer',
        },
      }}
    />
  );
}
