import { FontSize, RGBA } from '@graftini/bricks';
import { toggleMark } from 'prosemirror-commands';
import { EditorView } from 'prosemirror-view';
import schema from './schema';

/**
 * Set the font size to the selected text in editor view.
 */
export function setFontSize(size: FontSize, view: EditorView) {
  toggleMark(schema.marks.fontSize, size)(view.state, view.dispatch);
}

/**
 * Set the font family for the selected text in editor view.
 */
export function setFontFamily(fontFamily: string, view: EditorView) {
  toggleMark(schema.marks.fontFamily, { fontFamily })(view.state, view.dispatch);
}

/**
 * Set the font weight for the selected text in editor view.
 */
export function setFontWeight(fontWeight: number, view: EditorView) {
  toggleMark(schema.marks.fontWeight, { fontWeight })(view.state, view.dispatch);
}

/**
 * Set the text color for the selected text in editor view.
 */
export function setTextColor(color: RGBA, view: EditorView) {
  toggleMark(schema.marks.color, { ...color, a: color.a ?? 1 })(view.state, view.dispatch);
}
