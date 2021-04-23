/** @jsxImportSource @emotion/react */
import { useNode } from '@craftjs/core';
import { useCallback } from 'react';
import { rgbaToCss } from 'utils/colors';
import { parseInteger, parsePositiveInteger } from 'utils/parser';
import CanvasForm from './form/CanvasForm';
import NumberInput from './form/NumberInput';
import SpacingField from './form/SpacingField';
import TextInput from './form/TextInput';
import Outline from './Outline';

export default function Container({
  name,
  width,
  height,
  padding,
  margin,
  backgroundColor,
  children,
}) {
  const {
    connectors: { drag },
  } = useNode();

  return (
    <Outline name={name} width={width}>
      <div
        ref={drag}
        css={{
          width,
          // If there is no children and no height, give it some so that it is visible.
          // TODO: https://github.com/pepsighan/nocode/issues/15.
          height: height ?? (!children ? 80 : null),
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
    </Outline>
  );
}

Container.craft = {
  props: {
    width: null,
    height: null,
    padding: null,
    margin: {},
    backgroundColor: { r: 220, g: 220, b: 255, a: 1 },
  },
};

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
    </CanvasForm>
  );
}

Container.Options = Options;
