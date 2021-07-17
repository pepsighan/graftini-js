import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  EditorState,
  Modifier,
  SelectionState,
} from 'draft-js';
import { Text } from '@graftini/bricks';
import { useRouter } from 'next/router';

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

export const compositeDecorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: LinkRender,
  },
]);

function findLinkEntities(
  block: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) {
  block.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === EntityKind.Link;
  }, callback);
}

function LinkRender({ children, entityKey, contentState }) {
  const { link } = contentState.getEntity(entityKey).getData();
  const { route, query } = useRouter();

  let to: string | undefined;

  if (link?.pageId) {
    // We cannot have the routing system for the preview with actual path, so we will just
    // use the page ids. The actual deployment is able to do it because it knows all about what
    // routes exist based on the files generated.
    to = `${route.replace('[projectId]', query.projectId as string)}?page=${link.pageId}`;
  }

  // Though this is a link, in the editor we do not want any interaction so tag has to be
  // span.
  return (
    <Text tag="span" to={to} href={link?.href} displayInline isEditor>
      {children}
    </Text>
  );
}
