import { Grid, GridItem, Text } from '@chakra-ui/layout';
import { ROOT_NODE_ID } from '@graftini/graft';
import { useCallback } from 'react';
import CanvasForm, { CanvasFormComponent } from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import SyncFormState from './form/SyncFormState';
import { RootProps } from './Root';

export default function RootOptions() {
  const CF = CanvasForm as CanvasFormComponent<RootProps, RootProps>;

  return (
    <CF componentId={ROOT_NODE_ID} onInitialize={useCallback((initialState) => initialState, [])}>
      <SyncFormState
        componentId={ROOT_NODE_ID}
        onSync={useCallback((state: RootProps) => state, [])}
      />

      {/* Making a 8 column grid system. */}
      <Grid templateColumns="repeat(8, minmax(0, 1fr))" alignItems="center" gap={4}>
        <GridItem colSpan={8} mb={1}>
          <Text fontSize="sm" fontWeight="bold">
            Appearance
          </Text>
        </GridItem>
        <GridItem colSpan={8}>
          <ColorPicker name="color" label="Color" />
        </GridItem>
      </Grid>
    </CF>
  );
}
