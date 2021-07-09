import { RawDraftContentBlock, RawDraftContentState } from 'draft-js';
import React, { ReactNode } from 'react';
import { RGBA } from './colors';
import Text, { FontSize } from './text';

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
      <Text key={spans.length} tag="span" displayInline {...resolveStyle(newSpanStyle)}>
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
      <Text key={spans.length} tag="span" displayInline {...resolveStyle(newSpanStyle)}>
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
  const props: any = {};

  newSpanStyle.forEach((styleOption) => {
    const splits = styleOption.split('=');
    const [key, value] = propForOption(splits[0] as StyleOption, splits[1]);
    if (key) {
      props[key] = value;
    }
  });

  return props;
}

/**
 * All the supported inline style keys.
 */
enum StyleOption {
  TextSelection = 'TEXT_SELECTION',
  FontSize = 'FONT_SIZE',
  FontFamily = 'FONT_FAMILY',
  FontWeight = 'FONT_WEIGHT',
  TextColor = 'TEXT_COLOR',
}

/**
 * Depending on the style option, creates text prop for it.
 */
function propForOption(option: StyleOption, style: string): [string, any] {
  switch (option) {
    case StyleOption.FontFamily:
      return ['fontFamily', style];
    case StyleOption.FontSize:
      return ['fontSize', parseFontSize(style)];
    case StyleOption.FontWeight:
      return ['fontWeight', style];
    case StyleOption.TextColor:
      return ['color', parseColor(style)];
    default:
      return ['', null];
  }
}

/**
 * Parse the font size from string.
 */
function parseFontSize(size: string): FontSize {
  const splits = size.split(',');
  return {
    size: splits[1] === 'rem' ? parseFloat(splits[0]) : parseInt(splits[0], 10),
    unit: splits[1] as any,
  };
}

/**
 * Parses RGBA color from string.
 */
function parseColor(color: string): RGBA {
  if (color.startsWith('#')) {
    const r = color.substr(1, 2);
    const g = color.substr(3, 2);
    const b = color.substr(5, 2);

    return {
      r: parseInt(r, 16),
      g: parseInt(g, 16),
      b: parseInt(b, 16),
      a: 1,
    };
  }

  const splits = color.replace('rgba(', '').replace(')', '').split(',');
  return {
    r: parseInt(splits[0], 10),
    g: parseInt(splits[1], 10),
    b: parseInt(splits[2], 10),
    a: parseFloat(splits[3]),
  };
}
