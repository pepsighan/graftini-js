import { GridItem, Text } from '@chakra-ui/layout';

export default function Labelled({ label, children }) {
  return (
    <>
      <GridItem colSpan={2}>
        <Text as="span" fontSize="sm">
          {label}
        </Text>
      </GridItem>
      <GridItem colSpan={4}>{children}</GridItem>
    </>
  );
}
