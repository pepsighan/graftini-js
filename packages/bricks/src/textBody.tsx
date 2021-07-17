import { RawDraftContentBlock, RawDraftContentState, RawDraftEntity } from 'draft-js';
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
        <Block key={block.key} block={block} entityMap={content.entityMap} />
      ))}
    </>
  );
}

type BlockProps = {
  block: RawDraftContentBlock;
  entityMap: EntityMap;
};

type SpanType = 'inline-style' | 'entity';
type SpanValue = string | number; // This is the value for the kind of span.

function Block({ block, entityMap }: BlockProps) {
  const spans: ReactNode[] = [];
  let newSpanSection = new Map<SpanType, SpanValue>();
  let newSpan = '';

  for (let index = 0; index < block.text.length; index += 1) {
    const section = new Map<SpanType, SpanValue>();

    block.inlineStyleRanges.forEach((range) => {
      if (index >= range.offset && index < range.offset + range.length) {
        // The style applies.
        section.set('inline-style', range.style);
      }
    });

    block.entityRanges.forEach((entityRange) => {
      if (index >= entityRange.offset && index < entityRange.offset + entityRange.length) {
        // The entity is applicable.
        section.set('entity', entityRange.key);
      }
    });

    if (isSpanStylesSame(newSpanSection, section)) {
      newSpan += block.text[index];
      continue;
    }

    // Since the styles are no longer same, add the span to spans & reset
    // newSpan & newSpanStyle for the current.
    spans.push(
      <Text
        key={spans.length}
        tag="span"
        displayInline
        {...resolveStyleForInlineContent(newSpanSection)}
      >
        {newSpan}
      </Text>
    );

    // Adding the new text and style.
    newSpanSection = section;
    newSpan = block.text[index];
  }

  if (newSpan) {
    // Flush the final bits of text.
    spans.push(
      <Text
        key={spans.length}
        tag="span"
        displayInline
        {...resolveStyleForInlineContent(newSpanSection)}
        {...resolveEntityPropsForInlineContent(newSpanSection, entityMap)}
      >
        {newSpan}
      </Text>
    );
  }

  return (
    <Text tag="div" {...resolveStyleForBlock(block.data ?? {})}>
      {block.text ? spans : <br />}
    </Text>
  );
}

/**
 * The options that can be provided in the block data.
 */
enum BlockDataOption {
  TextAlignment = 'TEXT_ALIGNMENT',
}

/**
 * Resolve the styles for the block based on the block data.
 */
function resolveStyleForBlock(data: any): any {
  const props: any = {};

  const alignment = data[BlockDataOption.TextAlignment];
  props.textAlign = alignment ?? 'left';

  return props;
}

/**
 * Whether the two styles set are the same.
 */
function isSpanStylesSame(
  left: Map<SpanType, SpanValue>,
  right: Map<SpanType, SpanValue>
): boolean {
  if (left.size !== right.size) {
    return false;
  }

  return Object.keys(left).every((key) => right.get(key as SpanType) === left.get(key as SpanType));
}

/**
 * Resolves the set of style strings to actual style props for the Text component.
 */
function resolveStyleForInlineContent(newSpanStyle: Map<SpanType, SpanValue>): any {
  const props: any = {};

  newSpanStyle.forEach((kind, type) => {
    if (type !== 'inline-style') {
      return;
    }

    const splits = (kind as string).split('=');
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

type EntityMap = { [key: string]: RawDraftEntity };

enum EntityKind {
  Link = 'LINK',
}

type Link = {
  to?: string;
  href?: string;
};

/**
 * Resolves the props of the Text component for an entity.
 */
function resolveEntityPropsForInlineContent(
  spanProps: Map<SpanType, SpanValue>,
  entityMap: EntityMap
): any {
  const props: any = {};

  spanProps.forEach((kind, type) => {
    if (type !== 'entity') {
      return;
    }

    const entity = entityMap[kind as number];
    const entityKind = entity.type;
    if (entityKind !== EntityKind.Link) {
      return;
    }

    const data = entity.data as Link;

    props.tag = 'a';
    props.to = data.to ? data.to : undefined;
    props.href = !data.to ? data.href : undefined;
  });

  return props;
}
