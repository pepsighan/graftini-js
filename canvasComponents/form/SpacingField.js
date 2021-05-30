import { Grid, GridItem, Input } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export default function SpacingField({ name }) {
  const { register } = useFormContext();
  return (
    <Grid templateColumns="repeat(3, minmax(0, 1fr))">
      <GridItem colStart={2} colEnd={3}>
        <Input size="sm" bg="white" {...register(`${name}.top`)} autoComplete="off" />
      </GridItem>
      <GridItem colStart={1} colEnd={2}>
        <Input size="sm" bg="white" {...register(`${name}.right`)} autoComplete="off" />
      </GridItem>
      <GridItem colStart={3}>
        <Input size="sm" bg="white" {...register(`${name}.left`)} autoComplete="off" />
      </GridItem>
      <GridItem colStart={2} colEnd={3}>
        <Input size="sm" bg="white" {...register(`${name}.bottom`)} autoComplete="off" />
      </GridItem>
    </Grid>
  );
}
