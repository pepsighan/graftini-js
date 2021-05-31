import { Input } from '@chakra-ui/input';
import { Flex } from '@chakra-ui/layout';
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/slider';
import { Controller, useFormContext } from 'react-hook-form';

export default function OpacityInput({ name }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Flex>
          <Slider
            name={name}
            min={0}
            max={1}
            step={0.01}
            value={field.value}
            onChange={field.onChange}
            flex={3}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Input
            as="span"
            ml={3}
            flex={1}
            name={name}
            type="number"
            size="sm"
            bg="white"
            maxWidth={14}
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
          >
            {field.value}
          </Input>
        </Flex>
      )}
    />
  );
}
