import { useCallback } from 'react';
import { parseInteger, parsePositiveInteger } from 'utils/parser';
import CanvasForm from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import NumberInput from './form/NumberInput';
import SpacingField from './form/SpacingField';
import TextInput from './form/TextInput';

export default function ContainerOptions({ componentId }) {
  return (
    <CanvasForm
      componentId={componentId}
      onTransformValues={useCallback((values) => {
        values.width = parsePositiveInteger(values.width);
        values.height = parsePositiveInteger(values.height);

        values.padding = values.padding ?? {};
        values.padding.top = parseInteger(values.padding?.top);
        values.padding.right = parseInteger(values.padding?.right);
        values.padding.bottom = parseInteger(values.padding?.bottom);
        values.padding.left = parseInteger(values.padding?.left);

        values.margin = values.margin ?? {};
        values.margin.top = parseInteger(values.margin?.top);
        values.margin.right = parseInteger(values.margin?.right);
        values.margin.bottom = parseInteger(values.margin?.bottom);
        values.margin.left = parseInteger(values.margin?.left);
      }, [])}
    >
      <TextInput name="name" label="Name" />
      <NumberInput name="width" label="Width" spaceTop />
      <NumberInput name="height" label="Height" spaceTop />
      <SpacingField name="padding" label="Padding" spaceTop />
      <SpacingField name="margin" label="Margin" spaceTop />
      <ColorPicker name="color" label="Background Color" spaceTop />
    </CanvasForm>
  );
}
