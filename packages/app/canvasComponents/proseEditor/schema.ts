import { rgbaToCss } from '@graftini/bricks';
import { Schema } from 'prosemirror-model';

export enum NodeKind {
  Doc = 'doc',
  Paragraph = 'paragraph',
  Text = 'text',
}

export enum ParagraphAttribute {
  TextAlign = 'textAlign',
}

export enum MarkKind {
  FontSize = 'fontSize',
  FontFamily = 'fontFamily',
  FontWeight = 'fontWeight',
  TextColor = 'color',
  Link = 'link',
}

const schema = new Schema({
  nodes: {
    [NodeKind.Doc]: { content: 'paragraph+' },
    [NodeKind.Paragraph]: {
      attrs: {
        [ParagraphAttribute.TextAlign]: { default: 'left' },
      },
      content: 'text*',
      toDOM: (node) => {
        const { textAlign } = node.attrs;
        return ['div', { style: `text-align: ${textAlign};` }, 0];
      },
    },
    [NodeKind.Text]: { inline: true },
  },
  marks: {
    [MarkKind.FontSize]: {
      attrs: {
        size: {},
        unit: {},
      },
      toDOM: (node) => {
        const { size, unit } = node.attrs;
        return ['span', { style: `display: inline; font-size: ${size}${unit};` }, 0];
      },
    },
    [MarkKind.FontFamily]: {
      attrs: {
        fontFamily: {},
      },
      toDOM: (node) => {
        const { fontFamily } = node.attrs;
        return ['span', { style: `display: inline; font-family: ${fontFamily};` }, 0];
      },
    },
    [MarkKind.FontWeight]: {
      attrs: {
        fontWeight: {},
      },
      toDOM: (node) => {
        const { fontWeight } = node.attrs;
        return ['span', { style: `display: inline; font-weight: ${fontWeight};` }, 0];
      },
    },
    [MarkKind.TextColor]: {
      attrs: {
        r: {},
        g: {},
        b: {},
        a: {},
      },
      toDOM: (node) => {
        const { r, g, b, a } = node.attrs;
        return ['span', { style: `display: inline; color: ${rgbaToCss({ r, g, b, a })};` }, 0];
      },
    },
    [MarkKind.Link]: {
      attrs: {
        pageId: { default: null },
        href: { default: null },
      },
      toDOM: () => {
        return ['span', { style: 'display: inline; text-decoration: underline;' }, 0];
      },
    },
  },
});

export default schema;
