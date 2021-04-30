/** @jsxImportSource @emotion/react */
import { useNode } from '@craftjs/core';
import { useCallback } from 'react';
import Editor from 'rich-markdown-editor';
import { rgbaToCss } from 'utils/colors';
import { parsePositiveInteger } from 'utils/parser';
import CanvasForm from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import NumberInput from './form/NumberInput';
import TextInput from './form/TextInput';
import Outline from './Outline';

export default function Text({ name, color, fontSize, content }) {
  const {
    connectors: { drag },
    actions: { setProp },
  } = useNode();

  return (
    <Outline name={name}>
      <div
        ref={drag}
        css={{
          color: rgbaToCss(color),
          fontSize,
        }}
      >
        <Editor
          defaultValue={content}
          theme={{
            background: 'transparent',
          }}
          onChange={useCallback(
            (getText) =>
              setProp((props) => {
                props.content = getText();
              }),
            [setProp]
          )}
        />
      </div>
    </Outline>
  );
}

Text.craft = {
  props: {
    color: { r: 0, g: 0, b: 0, a: 1 },
    content: 'Lorem ipsum dolor sit amet.',
    fontSize: 16,
  },
};

Text.Render = ({ color, fontSize, content }) => {
  return (
    <div
      css={{
        color: rgbaToCss(color),
        fontSize,
      }}
    >
      {content}
    </div>
  );
};

function Options({ componentId }) {
  return (
    <CanvasForm
      componentId={componentId}
      onTransformValues={useCallback((values) => {
        values.fontSize = parsePositiveInteger(values.fontSize);
      }, [])}
    >
      <TextInput name="name" label="Name" />
      <NumberInput name="fontSize" label="Font Size" spaceTop />
      <ColorPicker name="color" label="Color" spaceTop />
    </CanvasForm>
  );
}

Text.Options = Options;
