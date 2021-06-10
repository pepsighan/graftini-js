import { Grid, GridItem, Text } from '@chakra-ui/layout';
import { ROOT_NODE_ID } from 'graft';
import { useCallback } from 'react';
import CanvasForm, { CanvasFormComponent } from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import Labelled from './form/Labelled';
import Root, { RootProps } from './Root';

export default function RootOptions() {
  const CF = CanvasForm as CanvasFormComponent<RootProps, RootProps>;

  return (
    <CF
      componentId={ROOT_NODE_ID}
      fieldNames={Object.keys(Root.graftOptions.defaultProps)}
      onInitialize={useCallback((initialState) => initialState, [])}
      onTransformValues={useCallback(() => {
        // No modification needed here.
      }, [])}
    >
      {/* Making a 6 column grid system. */}
      <Grid templateColumns="repeat(6, minmax(0, 1fr))" alignItems="center" gap={4}>
        <GridItem colSpan={6} mt={4} mb={1}>
          <Text fontSize="sm" fontWeight="bold">
            Appearance
          </Text>
        </GridItem>
        <Labelled label="Color">
          <ColorPicker name="color" />
        </Labelled>
      </Grid>
    </CF>
  );
}
