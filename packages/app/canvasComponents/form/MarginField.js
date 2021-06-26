import { Grid, GridItem, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { parseInteger } from 'utils/parser';

// TODO: Typing negative numbers is kind of weird. Cannot start typing with - right now.
// Has to be some non-zero positive number written first and then - prepended. Which is
// not good experience.
export default function MarginField({ name }) {
  return (
    <Grid templateColumns="repeat(3, minmax(0, 1fr))">
      <GridItem colStart={2} colEnd={3}>
        <NumberInputWithLabel name={`${name}.top`} label="T" />
      </GridItem>
      <GridItem colStart={1} colEnd={2}>
        <NumberInputWithLabel name={`${name}.left`} label="L" />
      </GridItem>
      <GridItem colStart={3}>
        <NumberInputWithLabel name={`${name}.right`} label="R" />
      </GridItem>
      <GridItem colStart={2} colEnd={3}>
        <NumberInputWithLabel name={`${name}.bottom`} label="B" />
      </GridItem>
    </Grid>
  );
}

function NumberInputWithLabel({ name, label }) {
  const { register, setValue } = useFormContext();
  const { onChange, onBlur, ...rest } = register(name);

  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        fontSize="sm"
        height="100%"
        width={6}
        justifyContent="flex-end"
        pr={1}
        color="gray.500"
      >
        {label}
      </InputLeftElement>
      <Input
        {...rest}
        onChange={useCallback(
          (event) => {
            setValue(name, parseInteger(event.target.value) || 0, {
              shouldDirty: true,
              shouldValidate: true,
            });
          },
          [name, setValue]
        )}
        size="sm"
        bg="white"
        autoComplete="off"
        pb="1px" // Align the input text with the label.
        sx={{
          paddingInlineStart: 6,
        }}
      />
    </InputGroup>
  );
}
