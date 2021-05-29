import { Box, Input } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { SketchPicker } from 'react-color';
import { Controller, useFormContext } from 'react-hook-form';
import { rgbToHex } from 'utils/colors';

export default function ColorPicker({ name }) {
  const { control } = useFormContext();

  const [picking, setPicking] = useState(false);
  const onPick = useCallback(() => setPicking(true), []);

  const onClosePicker = useCallback(() => setPicking(false), []);

  return (
    <Controller
      name={name}
      control={control}
      render={(props) => {
        return (
          <>
            <Box flex={1} position="relative">
              <Input
                size="sm"
                bg="white"
                value={props.field.value ? rgbToHex(props.field.value) : ''}
                readOnly
                onClick={onPick}
              />

              {picking && (
                <Box position="absolute" top={42} right={0} zIndex={2}>
                  {/* When clicked outside the picker, close it. */}
                  <Box
                    position="fixed"
                    top={0}
                    right={0}
                    bottom={0}
                    left={0}
                    onClick={onClosePicker}
                  />

                  <SketchPicker
                    color={props.field.value}
                    onChange={(value) => props.field.onChange(value.rgb)}
                  />
                </Box>
              )}
            </Box>
          </>
        );
      }}
    />
  );
}
