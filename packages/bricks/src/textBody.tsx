import React from 'react';
import Box from './box';
import { RGBA } from './colors';
import Text, { FontSize, FontWeight, TextAlign } from './text';

type TextBodyProps = {
  content: ProseMirrorDocument;
};

export type ProseMirrorDocument = {
  type: 'doc';
  content: ProseMirrorParagraph[];
};

type ProseMirrorParagraph = {
  type: 'paragraph';
  attrs: {
    textAlign: TextAlign;
  };
  content?: ProseMirrorText[];
};

type ProseMirrorText = {
  type: 'text';
  marks: Mark[];
  text: string;
};

type Mark = FontSizeMark | FontFamilyMark | FontWeightMark | ColorMark;

type FontSizeMark = {
  type: 'fontSize';
  attrs: FontSize;
};

type FontFamilyMark = {
  type: 'fontFamily';
  attrs: {
    fontFamily: string;
  };
};

type FontWeightMark = {
  type: 'fontWeight';
  attrs: {
    fontWeight: FontWeight;
  };
};

type ColorMark = {
  type: 'color';
  attrs: RGBA;
};

/**
 * A renderer for the text content.
 */
/** @internal */
export default function TextBody({ content }: TextBodyProps) {
  // TODO: Only check them during development. Remove these assertions when deployed.
  if (content.type !== 'doc') {
    throw new Error('content must have a doc type.');
  }

  return (
    <>
      {content.content.map((paragraph, index) => (
        <Paragraph key={index} paragraph={paragraph} />
      ))}
    </>
  );
}

type ParagraphProps = {
  paragraph: ProseMirrorParagraph;
};

function Paragraph({ paragraph }: ParagraphProps) {
  if (paragraph.type !== 'paragraph') {
    throw new Error('this is not a paragraph. type is invalid.');
  }

  return (
    <Text tag="div" textAlign={paragraph.attrs.textAlign}>
      {(paragraph.content ?? []).map((text, index) => (
        <TextItem key={index} text={text} />
      ))}

      {/* When there is no content, we show an empty box to signify there is a text component.
      And to mimic as if there is a content, we give it the height equal to the default font
      size. */}
      {!paragraph.content && <Box tag="br" height={{ size: 16, unit: 'px' }} />}
    </Text>
  );
}

type TextItemProps = {
  text: ProseMirrorText;
};

function TextItem({ text }: TextItemProps) {
  if (text.type !== 'text') {
    throw new Error('this is not a text. type is invalid.');
  }

  let color: RGBA | undefined;
  let fontFamily: string | undefined;
  let fontSize: FontSize | undefined;
  let fontWeight: FontWeight | undefined;

  (text.marks ?? []).forEach((it) => {
    switch (it.type) {
      case 'color':
        color = it.attrs;
        break;
      case 'fontFamily':
        fontFamily = it.attrs.fontFamily;
        break;
      case 'fontSize':
        fontSize = it.attrs;
        break;
      case 'fontWeight':
        fontWeight = it.attrs.fontWeight;
    }
  });

  return (
    <Text
      tag="span"
      fontSize={fontSize}
      color={color}
      fontFamily={fontFamily}
      fontWeight={fontWeight}
      displayInline
    >
      {text.text}
    </Text>
  );
}
