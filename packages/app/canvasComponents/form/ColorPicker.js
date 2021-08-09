import { Box } from '@material-ui/core';
import { RgbaColorPicker } from 'react-colorful';
import ColorPalette from './ColorPalette';

export default function ColorPicker({ value, onChange, padding = 1.2 }) {
  return (
    <Box
      sx={{
        width: 200,
        '& .react-colorful': {
          pt: padding,
          px: padding,
          height: 200,
          borderRadius: 0,
        },
        '& .react-colorful__saturation': {
          borderRadius: '0 !important',
          borderBottomWidth: 2,
        },
        '& .react-colorful__hue': {
          my: 1,
        },
        '& .react-colorful__hue, & .react-colorful__alpha': {
          borderRadius: '0 !important',
          height: 6,
        },
        ['& .react-colorful__saturation-pointer,' +
        ' & .react-colorful__hue-pointer, ' +
        ' & .react-colorful__alpha-pointer']: {
          height: 10,
          width: 10,
          cursor: 'pointer',
        },
        '& .react-colorful__last-control': {
          borderRadius: '0 !important',
        },
      }}
    >
      <RgbaColorPicker color={value} onChange={onChange} />
      <Box
        sx={{
          px: padding,
          pb: 1,
          pt: 0.5,
        }}
      >
        <ColorPalette onChange={onChange} />
      </Box>
    </Box>
  );
}
