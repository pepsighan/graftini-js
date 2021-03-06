import { FontSize, RGBA, TextAlign } from '@graftini/bricks';
import { MarkType, NodeType } from 'prosemirror-model';
import { Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import schema from './schema';

/**
 * Set the font size to the selected text in editor view.
 */
export function setFontSize(size: FontSize, view: EditorView, selection: Selection) {
  setMark(schema.marks.fontSize, size, view, selection);
}

/**
 * Set the font family for the selected text in editor view.
 */
export function setFontFamily(fontFamily: string, view: EditorView, selection: Selection) {
  setMark(schema.marks.fontFamily, { fontFamily }, view, selection);
}

/**
 * Set the font weight for the selected text in editor view.
 */
export function setFontWeight(fontWeight: number, view: EditorView, selection: Selection) {
  setMark(schema.marks.fontWeight, { fontWeight }, view, selection);
}

/**
 * Set the text color for the selected text in editor view.
 */
export function setTextColor(color: RGBA, view: EditorView, selection: Selection) {
  setMark(schema.marks.color, { ...color, a: color.a ?? 1 }, view, selection);
}

/**
 * Set the link using page Id for the selected text.
 */
export function setLinkWithPageId(pageId: string, view: EditorView, selection: Selection) {
  setMark(schema.marks.link, { pageId }, view, selection);
}

/**
 * Set the link using href for the selected text.
 */
export function setLinkWithHref(href: string, view: EditorView, selection: Selection) {
  setMark(schema.marks.link, { href }, view, selection);
}

/**
 * Remove link from the selected text.
 */
export function unsetLink(view: EditorView, selection: Selection) {
  unsetMark(schema.marks.link, view, selection);
}

/**
 * Set the text alignment for the paragraph that is selected in the editor view.
 */
export function setTextAlign(textAlign: TextAlign, view: EditorView, selection: Selection) {
  setBlockType(schema.nodes.paragraph, { textAlign }, view, selection);
}

/**
 * Sets the mark for the selected text.
 * This is adapted from the prosemirror-commands library.
 */
function setMark(
  markType: MarkType<any>,
  attrs: { [key: string]: any },
  view: EditorView,
  selection: Selection
): boolean {
  const state = view.state;
  const dispatch = view.dispatch;

  const { empty, $cursor, ranges } = selection as any;

  if ((empty && !$cursor) || !markApplies(state.doc, ranges, markType)) {
    return false;
  }

  if (dispatch) {
    if ($cursor) {
      // Remove the marks if it exists.
      if (markType.isInSet(state.storedMarks || $cursor.marks())) {
        dispatch(state.tr.removeStoredMark(markType));
      }
      // Add it with updated attributes.
      dispatch(state.tr.addStoredMark(markType.create(attrs)));
    } else {
      let has = false;
      const tr = state.tr;

      for (let i = 0; !has && i < ranges.length; i++) {
        let { $from, $to } = ranges[i];
        has = state.doc.rangeHasMark($from.pos, $to.pos, markType);
      }
      for (let i = 0; i < ranges.length; i++) {
        const { $from, $to } = ranges[i];

        // Remove the marks if it exists.
        if (has) {
          tr.removeMark($from.pos, $to.pos, markType);
        }

        let from = $from.pos;
        let to = $to.pos;
        const start = $from.nodeAfter;
        const end = $to.nodeBefore;

        const spaceStart = start && start.isText ? /^\s*/.exec(start.text)[0].length : 0;
        const spaceEnd = end && end.isText ? /\s*$/.exec(end.text)[0].length : 0;
        if (from + spaceStart < to) {
          from += spaceStart;
          to -= spaceEnd;
        }

        // Add it with updated attributes.
        tr.addMark(from, to, markType.create(attrs));
      }
      dispatch(tr.scrollIntoView());
    }
  }
  return true;
}

/**
 * Unsets the mark for the selected text.
 */
function unsetMark(markType: MarkType<any>, view: EditorView, selection: Selection): boolean {
  const state = view.state;
  const dispatch = view.dispatch;

  const { empty, $cursor, ranges } = selection as any;

  if ((empty && !$cursor) || !markApplies(state.doc, ranges, markType)) {
    return false;
  }

  if (dispatch) {
    if ($cursor) {
      // Remove the marks if it exists.
      if (markType.isInSet(state.storedMarks || $cursor.marks())) {
        dispatch(state.tr.removeStoredMark(markType));
      }
    } else {
      let has = false;
      const tr = state.tr;

      for (let i = 0; !has && i < ranges.length; i++) {
        let { $from, $to } = ranges[i];
        has = state.doc.rangeHasMark($from.pos, $to.pos, markType);
      }

      for (let i = 0; i < ranges.length; i++) {
        const { $from, $to } = ranges[i];
        // Remove the marks if it exists.
        if (has) {
          tr.removeMark($from.pos, $to.pos, markType);
        }
      }
      dispatch(tr.scrollIntoView());
    }
  }

  return true;
}

function markApplies(doc: any, ranges: any, type: any) {
  for (let i = 0; i < ranges.length; i++) {
    const { $from, $to } = ranges[i];
    let can = $from.depth === 0 ? doc.type.allowsMarkType(type) : false;

    doc.nodesBetween($from.pos, $to.pos, (node: any) => {
      if (can) {
        return false;
      }
      can = node.inlineContent && node.type.allowsMarkType(type);
    });

    if (can) {
      return true;
    }
  }

  return false;
}

/**
 * Sets the block type of the selected text.
 * This is adapted from the prosemirror-commands library.
 */
function setBlockType(
  nodeType: NodeType,
  attrs: { [key: string]: any },
  view: EditorView,
  selection: Selection
) {
  const { from, to } = selection;
  const state = view.state;
  const dispatch = view.dispatch;

  let applicable = false;

  state.doc.nodesBetween(from, to, (node, pos) => {
    if (applicable) {
      return false;
    }

    if (!node.isTextblock || node.hasMarkup(nodeType, attrs)) {
      return;
    }

    if (node.type === nodeType) {
      applicable = true;
    } else {
      let $pos = state.doc.resolve(pos),
        index = $pos.index();
      applicable = $pos.parent.canReplaceWith(index, index + 1, nodeType);
    }
  });

  if (!applicable) {
    return false;
  }

  if (dispatch) {
    dispatch(state.tr.setBlockType(from, to, nodeType, attrs).scrollIntoView());
  }

  return true;
}
