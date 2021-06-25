import React from 'react';

type TextBodyProps = {
  content: Content[];
};

export type Content = Paragraph | TextString;
type Paragraph = {
  type: 'paragraph';
  children: Content[];
};

type TextString = {
  text: string;
};

/**
 * A renderer for the text content.
 */
/** @internal */
export default function TextBody({ content }: TextBodyProps) {
  return (
    <>
      {content.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </>
  );
}

type BlockProps = {
  block: Content;
};

function Block({ block }: BlockProps) {
  if (typeof (block as TextString).text === 'string') {
    const text = (block as any).text;
    return text;
  }

  const paragraph = block as Paragraph;

  if (paragraph.type === 'paragraph') {
    return (
      <p>
        {paragraph.children.map((n, index) => (
          <Block key={index} block={n} />
        ))}
      </p>
    );
  }

  return null;
}
