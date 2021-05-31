import { Grid, GridItem } from '@chakra-ui/react';
import NumberInput from './NumberInput';

export default function RadiusInput({ name }) {
  return (
    <Grid templateColumns="repeat(2, minmax(0, 1fr))">
      <GridItem colSpan={1}>
        <NumberInput name={`${name}.topLeft`} />
      </GridItem>
      <GridItem colSpan={1}>
        <NumberInput name={`${name}.topRight`} />
      </GridItem>
      <GridItem colSpan={1}>
        <NumberInput name={`${name}.bottomLeft`} />
      </GridItem>
      <GridItem colSpan={1}>
        <NumberInput name={`${name}.bottomRight`} />
      </GridItem>
    </Grid>
  );
}
