import { EditorState } from 'draft-js';

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
export function createLink(state: EditorState, link: Link): [EditorState, string] {
  const contentState = state.getCurrentContent();
  const withLink = contentState.createEntity(EntityKind.Link, 'MUTABLE', { link });
  return [EditorState.createWithContent(withLink), withLink.getLastCreatedEntityKey()];
}
