import { Text } from '@chakra-ui/react';
import { useEditor } from '@craftjs/core';
import components from 'canvasComponents';
import { useCallback, useMemo } from 'react';

export default function StyleOptions() {
  const { componentId, query } = useEditor(
    useCallback((state) => ({ componentId: state.events.selected }), [])
  );

  const nodeType = useMemo(() => (componentId ? query.node(componentId).get().data.name : null), [
    query,
    componentId,
  ]);

  const Component = nodeType ? components[nodeType] : null;

  return (
    <>
      <Text fontWeight="bold" mb={2}>
        Styles
      </Text>
      {Component?.Options != null ? (
        <Component.Options key={componentId} componentId={componentId} />
      ) : null}
    </>
  );
}
