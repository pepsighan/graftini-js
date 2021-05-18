/** @jsxImportSource @emotion/react */
import { useEditorState, useElementId } from '@graftini/graft';
import { forwardRef, useCallback } from 'react';
import { rgbaToCss } from 'utils/colors';
import { parseInteger, parsePositiveInteger } from 'utils/parser';
import CanvasForm from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import NumberInput from './form/NumberInput';
import SpacingField from './form/SpacingField';
import TextInput from './form/TextInput';

const Container = forwardRef(({ name, width, height, children, ...rest }, ref) => {
  const elementId = useElementId();
  const hasChildren = useEditorState(
    useCallback((state) => state[elementId].childrenNodes.length > 0, [elementId])
  );

  return (
    <Render
      ref={ref}
      width={width}
      // If there is no children and no height, give it some so that it is visible.
      // TODO: https://github.com/pepsighan/nocode/issues/15.
      height={height ?? (hasChildren ? null : 80)}
      {...rest}
    >
      {children}
    </Render>
  );
});

Container.graftOptions = {
  defaultProps: {
    width: null,
    height: null,
    padding: null,
    margin: {},
    backgroundColor: { r: 220, g: 220, b: 255, a: 1 },
  },
};

const Render = forwardRef(({ width, height, padding, margin, backgroundColor, children }, ref) => {
  return (
    <div
      ref={ref}
      css={{
        width,
        height,
        marginTop: margin?.top,
        marginRight: margin?.right,
        marginBottom: margin?.bottom,
        marginLeft: margin?.left,
        paddingTop: padding?.top,
        paddingRight: padding?.right,
        paddingBottom: padding?.bottom,
        paddingLeft: padding?.left,
        backgroundColor: rgbaToCss(backgroundColor),
      }}
    >
      {children}
    </div>
  );
});

Container.Render = Render;

function Options({ componentId }) {
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
      <ColorPicker name="backgroundColor" label="Background Color" spaceTop />
    </CanvasForm>
  );
}

Container.Options = Options;

export default Container;
