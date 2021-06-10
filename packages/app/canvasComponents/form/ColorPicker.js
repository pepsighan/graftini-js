import { Box, Input, useDisclosure, useOutsideClick } from '@chakra-ui/react';
import { rgbaToCss } from 'bricks';
import { useEffect, useRef } from 'react';
import { RgbaColorPicker } from 'react-colorful';
import { Controller, useFormContext } from 'react-hook-form';
import { useCanvasClickTrigger } from 'store/canvasClickTrigger';
import StickyBox from './StickyBox';

export default function ColorPicker({ name }) {
  const { control } = useFormContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ref = useRef();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <>
            <Box flex={1} position="relative">
              <Input
                ref={ref}
                as="div"
                size="sm"
                bg="white"
                display="flex"
                alignItems="center"
                userSelect="none"
                cursor="pointer"
                onClick={onOpen}
              >
                {/* Show a chessboard bg to signify if there is transparency in the color. */}
                <Box
                  width={5}
                  height={5}
                  borderRadius="sm"
                  bg={field.value ? rgbaToCss(field.value) : null}
                  mr={3}
                />
                {/* Only need to show the hex and no transparency as textual. */}
                {field.value ? rgbaToCss({ ...field.value, a: null }) : ''}
              </Input>

              {isOpen && (
                <ColorPickerInner
                  value={field.value}
                  onChange={field.onChange}
                  onClose={onClose}
                  stickToRef={ref}
                />
              )}
            </Box>
          </>
        );
      }}
    />
  );
}

function ColorPickerInner({ stickToRef, value, onChange, onClose }) {
  const ref = useRef();
  useOutsideClick({ ref, handler: onClose });

  useEffect(() => {
    // If it received a click event from the the canvas, close this picker.
    // Normally outside click should have worked. Since, the root component
    // is within an iframe, it is not able to identify whether there was
    // a click outside.
    return useCanvasClickTrigger.subscribe(() => {
      onClose();
    });
  }, [onClose]);

  return (
    <StickyBox
      stickToRef={stickToRef}
      heightOfContent={200}
      sx={{
        '& .react-colorful': {
          padding: 3,
          backgroundColor: 'white',
          borderRadius: 'md',
          border: '1px',
          borderColor: 'gray.300',
          shadow: 'md',
          height: 200,
        },
        '& .react-colorful__saturation': {
          borderRadius: 'none',
          borderBottomWidth: 2,
        },
        '& .react-colorful__hue': {
          my: 3,
        },
        '& .react-colorful__hue, & .react-colorful__alpha': {
          borderRadius: 'none',
          height: 2,
        },
        ['& .react-colorful__saturation-pointer,' +
        ' & .react-colorful__hue-pointer, ' +
        ' & .react-colorful__alpha-pointer']: {
          height: 4,
          width: 4,
          cursor: 'pointer',
        },
      }}
    >
      <div ref={ref}>
        <RgbaColorPicker color={value} onChange={onChange} />
      </div>
    </StickyBox>
  );
}
