import React, { ReactNode } from 'react';
import { RawDraftContentState, RawDraftContentBlock } from 'draft-js';
import Text from './text';

type TextBodyProps = {
  content: RawDraftContentState;
};

/**
 * A renderer for the text content.
 */
/** @internal */
export default function TextBody({ content }: TextBodyProps) {
  return (
    <>
      {content.blocks.map((block) => (
        <Block key={block.key} block={block} />
      ))}
    </>
  );
}

type BlockProps = {
  block: RawDraftContentBlock;
};

function Block({ block }: BlockProps) {
  const spans: ReactNode[] = [];
  let newSpanStyle = new Set<string>();
  let newSpan = '';

  for (let index = 0; index < block.text.length; index += 1) {
    const applicableStyles = new Set<string>();

    block.inlineStyleRanges.forEach((range) => {
      if (index >= range.offset && index < range.offset + range.length) {
        // The style applies.
        applicableStyles.add(range.style);
      }
    });

    if (isSpanStylesSame(newSpanStyle, applicableStyles)) {
      newSpan += block.text[index];
      continue;
    }

    // Since the styles are no longer same, add the span to spans & reset
    // newSpan & newSpanStyle for the current.
    spans.push(
      <Text tag="span" displayInline {...resolveStyle(newSpanStyle)}>
        {newSpan}
      </Text>
    );

    // Adding the new text and style.
    newSpanStyle = new Set<string>(applicableStyles);
    newSpan = block.text[index];
  }

  if (newSpan) {
    // Flush the final bits of text.
    spans.push(
      <Text tag="span" displayInline {...resolveStyle(newSpanStyle)}>
        {newSpan}
      </Text>
    );
  }

  return <Text tag="div">{block.text ? spans : <br />}</Text>;
}

/**
 * Whether the two styles set are the same.
 */
function isSpanStylesSame(left: Set<string>, right: Set<string>): boolean {
  if (left.size !== right.size) {
    return false;
  }

  return Array.from(left).every((style) => right.has(style));
}

/**
 * Resolves the set of style strings to actual style props for the Text component.
 */
function resolveStyle(newSpanStyle: Set<string>): any {
  return {};
}

// 1. Start adding the characters to a new span.
// 2. Attach the respective style the span.
// 3. If the next character has the same style, then add it to the same span.
//    Otherwise, start from step 1.
