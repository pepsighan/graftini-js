import { Text } from '@chakra-ui/react';
import components from 'canvasComponents';

export default function StyleOptions() {
  const nodeType = null; // the kind of node that is selected.

  const Component = nodeType ? components[nodeType] : null;

  return (
    <>
      <Text fontWeight="bold" mb={2}>
        Styles
      </Text>
      {Component?.Options != null ? <Component.Options /> : null}
    </>
  );
}
