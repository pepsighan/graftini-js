import React from 'react';
import { RawDraftContentState, RawDraftContentBlock } from 'draft-js';

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
  return <div>{block.text ? <>{block.text}</> : <br />}</div>;
}
