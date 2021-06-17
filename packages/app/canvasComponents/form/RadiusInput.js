import { Flex, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { BoxIcon, CornersIcon } from '@modulz/radix-icons';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import SegmentedInput from './SegmentedInput';

export default function RadiusInput({ name }) {
  const { control, setValue } = useFormContext();
  const singleValue = useWatch({ control, name: `${name}.topLeft` });
  const toggle = useWatch({ control, name: `${name}.toggle` });

  const setV = useCallback(
    (name, value) => setValue(name, value, { shouldDirty: true, shouldValidate: true }),
    [setValue]
  );

  return (
    <>
      <Flex>
        <InputGroup mr={2}>
          <InputLeftElement
            pointerEvents="none"
            fontSize="sm"
            height="100%"
            width={14}
            justifyContent="flex-end"
            pr={1}
            color="gray.500"
          >
            Radius
          </InputLeftElement>
          <Input
            type="number"
            size="sm"
            bg="white"
            autoComplete="off"
            pb="1px" // Align the input text with the label.
            sx={{
              paddingInlineStart: 14,
            }}
            value={toggle === 'all' ? singleValue : ''}
            onChange={useCallback(
              (event) => {
                setV(`${name}.toggle`, 'all');
                setV(`${name}.topLeft`, event.target.value);
                setV(`${name}.topRight`, event.target.value);
                setV(`${name}.bottomLeft`, event.target.value);
                setV(`${name}.bottomRight`, event.target.value);
              },
              [name, setV]
            )}
          />
        </InputGroup>

        <SegmentedInput
          name={`${name}.toggle`}
          options={[
            { value: 'all', label: <BoxIcon />, tooltip: 'Radius' },
            { value: 'each', label: <CornersIcon />, tooltip: 'Radius Per Corner' },
          ]}
        />
      </Flex>

      {toggle === 'each' && (
        <Flex mt={2}>
          <NumberInputWithLabel name={`${name}.topLeft`} label="TL" />
          <NumberInputWithLabel name={`${name}.topRight`} label="TR" />
          <NumberInputWithLabel name={`${name}.bottomLeft`} label="BL" />
          <NumberInputWithLabel name={`${name}.bottomRight`} label="BR" />
        </Flex>
      )}
    </>
  );
}

function NumberInputWithLabel({ name, label }) {
  const { register } = useFormContext();

  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        fontSize="sm"
        height="100%"
        width={8}
        justifyContent="flex-end"
        pr={1}
        color="gray.500"
      >
        {label}
      </InputLeftElement>
      <Input
        {...register(name)}
        type="number"
        size="sm"
        bg="white"
        autoComplete="off"
        pb="1px" // Align the input text with the label.
        sx={{
          paddingInlineStart: 8,
        }}
      />
    </InputGroup>
  );
}
