import { FontSize, RGBA, TextAlign } from '@graftini/bricks';
import { setBlockType } from 'prosemirror-commands';
import { MarkType } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import schema from './schema';

/**
 * Set the font size to the selected text in editor view.
 */
export function setFontSize(size: FontSize, view: EditorView) {
  setMark(schema.marks.fontSize, size, view);
}

/**
 * Set the font family for the selected text in editor view.
 */
export function setFontFamily(fontFamily: string, view: EditorView) {
  setMark(schema.marks.fontFamily, { fontFamily }, view);
}

/**
 * Set the font weight for the selected text in editor view.
 */
export function setFontWeight(fontWeight: number, view: EditorView) {
  setMark(schema.marks.fontWeight, { fontWeight }, view);
}

/**
 * Set the text color for the selected text in editor view.
 */
export function setTextColor(color: RGBA, view: EditorView) {
  setMark(schema.marks.color, { ...color, a: color.a ?? 1 }, view);
}

/**
 * Set the text alignment for the paragraph that is selected in the editor view.
 */
export function setTextAlign(textAlign: TextAlign, view: EditorView) {
  setBlockType(schema.nodes.paragraph, { textAlign })(view.state, view.dispatch);
}

/**
 * Sets the mark for the selected text.
 * This is adapted from the prosemirror-commands library.
 */
function setMark(
  markType: MarkType<any>,
  attrs: { [key: string]: any },
  view: EditorView
): boolean {
  const state = view.state;
  const dispatch = view.dispatch;

  const { empty, $cursor, ranges } = state.selection as any;
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

        tr.addMark(from, to, markType.create(attrs));
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
