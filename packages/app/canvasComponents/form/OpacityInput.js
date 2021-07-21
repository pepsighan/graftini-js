import { Box, Slider, TextField, Typography } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';
import useEnableContextMenu from './useEnableContextMenu';

export default function OpacityInput({ name }) {
  const { control } = useFormContext();
  const onContextMenu = useEnableContextMenu();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" component="span" sx={{ mr: 2 }}>
            Opacity
          </Typography>

          <Slider
            size="small"
            min={0}
            max={1}
            step={0.01}
            valueLabelDisplay="auto"
            value={field.value}
            onChange={(_, value) => field.onChange(value)}
          />
          <TextField
            value={field.value}
            sx={{
              ml: 2,
              maxWidth: 60,
              '& .MuiOutlinedInput-input': {
                textAlign: 'center',
              },
            }}
            inputProps={{
              onContextMenu,
            }}
          />
        </Box>
      )}
    />
  );
}
