import { Grid, GridItem } from '@chakra-ui/react';
import NumberInput from './NumberInput';

export default function SpacingField({ name }) {
  return (
    <Grid templateColumns="repeat(3, minmax(0, 1fr))">
      <GridItem colStart={2} colEnd={3}>
        <NumberInput name={`${name}.top`} />
      </GridItem>
      <GridItem colStart={1} colEnd={2}>
        <NumberInput name={`${name}.right`} />
      </GridItem>
      <GridItem colStart={3}>
        <NumberInput name={`${name}.left`} />
      </GridItem>
      <GridItem colStart={2} colEnd={3}>
        <NumberInput name={`${name}.bottom`} />
      </GridItem>
    </Grid>
  );
}
