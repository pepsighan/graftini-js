import React from 'react';
import Text from './text';

type TextBodyProps = {
  content: ProseMirrorDocument;
};

export type ProseMirrorDocument = {
  type: 'doc';
  content: ProseMirrorParagraph[];
};

type ProseMirrorParagraph = {
  type: 'paragraph';
  content?: ProseMirrorText[];
};

type ProseMirrorText = {
  type: 'text';
  text: string;
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
    <Text tag="div">
      {(paragraph.content ?? []).map((text, index) => (
        <TextItem key={index} text={text} />
      ))}
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

  return (
    <Text tag="span" displayInline>
      {text.text}
    </Text>
  );
}
