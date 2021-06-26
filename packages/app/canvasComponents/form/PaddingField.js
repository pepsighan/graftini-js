import { Grid, GridItem, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { parsePositiveInteger } from 'utils/parser';

export default function PaddingField({ name }) {
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
  const { control, setValue } = useFormContext();
  const value = useWatch({ control, name });

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
        value={value}
        onChange={useCallback(
          (event) => {
            setValue(name, parsePositiveInteger(event.target.value) || 0);
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
