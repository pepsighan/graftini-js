import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  useOutsideClick,
} from '@chakra-ui/react';
import { rgbaToCss } from '@graftini/bricks';
import { TransparencyGridIcon } from '@modulz/radix-icons';
import { useEffect, useRef } from 'react';
import { RgbaColorPicker } from 'react-colorful';
import { Controller, useFormContext } from 'react-hook-form';
import { useCanvasClickTrigger } from 'store/canvasClickTrigger';
import StickyBox from './StickyBox';

export default function ColorPicker({ name, label = null, labelWidth = '14' }) {
  const { control } = useFormContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ref = useRef();

  return (
    <InputGroup>
      {label && (
        <InputLeftElement
          pointerEvents="none"
          fontSize="sm"
          height="100%"
          width={labelWidth}
          color="gray.600"
          justifyContent="flex-end"
          pr={2}
        >
          {label}
        </InputLeftElement>
      )}
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
                  sx={{
                    paddingInlineStart: label ? labelWidth : null,
                  }}
                >
                  {/* Show a chessboard bg to signify if there is transparency in the color. */}
                  <ColorBox value={field.value} />
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
    </InputGroup>
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

/**
 * Shows a preview of the color that is selected with a chessboard in the background if
 * there is transparency.
 */
function ColorBox({ value }) {
  return (
    <Box
      width={5}
      height={5}
      borderRadius="sm"
      overflow="hidden"
      mr={3}
      position="relative"
      border="1px"
      borderColor="gray.400"
    >
      <TransparencyGridIcon width="100%" height="100%" />
      <Box
        width="100%"
        height="100%"
        bg={value ? rgbaToCss(value) : null}
        position="absolute"
        top={0}
        left={0}
      />
    </Box>
  );
}
