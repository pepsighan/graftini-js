import { Box, Input, useDisclosure } from '@chakra-ui/react';
import { RgbaColorPicker } from 'react-colorful';
import { Controller, useFormContext } from 'react-hook-form';
import { rgbToHex } from 'utils/colors';

export default function ColorPicker({ name }) {
  const { control } = useFormContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <>
            <Box flex={1} position="relative">
              <Input
                as="div"
                size="sm"
                bg="white"
                display="flex"
                alignItems="center"
                userSelect="none"
                cursor="pointer"
                onClick={onOpen}
              >
                {field.value ? rgbToHex(field.value) : ''}
              </Input>

              {isOpen && (
                <ColorPickerInner value={field.value} onChange={field.onChange} onClose={onClose} />
              )}
            </Box>
          </>
        );
      }}
    />
  );
}

function ColorPickerInner({ value, onChange, onClose }) {
  return (
    <Box
      position="absolute"
      top="32px"
      right={0}
      zIndex="popover"
      sx={{
        '& .react-colorful': {
          padding: 3,
          backgroundColor: 'white',
          borderRadius: 'md',
          shadow: 'md',
        },
        '& .react-colorful__saturation': {
          borderRadius: 'none',
          height: '240px',
          borderBottomWidth: 4,
        },
        '& .react-colorful__hue': {
          my: 3,
        },
        '& .react-colorful__hue, & .react-colorful__alpha': {
          borderRadius: 'none',
          height: 4,
        },
        '& .react-colorful__saturation-pointer, & .react-colorful__hue-pointer, & .react-colorful__alpha-pointer':
          {
            height: 4,
            width: 4,
            cursor: 'pointer',
          },
      }}
    >
      {/* When clicked outside the picker, close it. */}
      <Box position="fixed" top={0} right={0} bottom={0} left={0} onClick={onClose} />
      <RgbaColorPicker color={value} onChange={onChange} />
    </Box>
  );
}
