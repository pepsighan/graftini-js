import { ContentState, EditorState, Modifier, SelectionState } from 'draft-js';

/**
 * The kinds of entities supported by the editor. Entities are blocks of
 * text that have a special meaning.
 */
export enum EntityKind {
  Link = 'LINK',
}

/**
 * A definition of a link. Either page id must be provided for internal navigation
 * or an href for external.
 */
export type Link = {
  pageId?: string;
  href?: string;
};

/**
 * Creates an entity link in the editor. Returns a new editor state with the entity
 * and the key of that entity.
 */
function createLink(state: ContentState, link: Link): [ContentState, string] {
  const withLink = state.createEntity(EntityKind.Link, 'MUTABLE', { link });
  return [withLink, withLink.getLastCreatedEntityKey()];
}

/**
 * Apply a link to the selected text.
 */
export function applyLink(state: EditorState, link: Link, selection: SelectionState): EditorState {
  const [withLink, entityKey] = createLink(state.getCurrentContent(), link);

  // Removes any previous entity for the selection. We do not want the links to overlap.
  const cleaned = Modifier.applyEntity(withLink, selection, null);
  const final = Modifier.applyEntity(cleaned, selection, entityKey);
  return EditorState.createWithContent(final);
}
