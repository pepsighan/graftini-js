/** @jsxImportSource @emotion/react */
import { useNode } from '@craftjs/core';
import { rgbaToCss } from 'utils/colors';
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
