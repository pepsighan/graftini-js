import { rgbaToCss } from '@graftini/bricks';
import { Schema } from 'prosemirror-model';

const schema = new Schema({
  nodes: {
    doc: { content: 'paragraph+' },
    paragraph: {
      attrs: {
        textAlign: { default: 'left' },
      },
      content: 'text*',
      toDOM: (node) => {
        const { textAlign } = node.attrs;
        return ['div', { style: `text-align: ${textAlign};` }, 0];
      },
    },
    text: { inline: true },
  },
  marks: {
    fontSize: {
      attrs: {
        size: {},
        unit: {},
      },
      toDOM: (node) => {
        const { size, unit } = node.attrs;
        return ['span', { style: `font-size: ${size}${unit};` }, 0];
      },
    },
    fontFamily: {
      attrs: {
        fontFamily: {},
      },
      toDOM: (node) => {
        const { fontFamily } = node.attrs;
        return ['span', { style: `font-family: ${fontFamily};` }, 0];
      },
    },
    fontWeight: {
      attrs: {
        fontWeight: {},
      },
      toDOM: (node) => {
        const { fontWeight } = node.attrs;
        return ['span', { style: `font-weight: ${fontWeight};` }, 0];
      },
    },
    color: {
      attrs: {
        r: {},
        g: {},
        b: {},
        a: {},
      },
      toDOM: (node) => {
        const { r, g, b, a } = node.attrs;
        return ['span', { style: `color: ${rgbaToCss({ r, g, b, a })};` }, 0];
      },
    },
  },
});

export default schema;
