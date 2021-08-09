import { decode, encode } from '@digitalmaas/uuid-base62';

export const urlRegex =
  // eslint-disable-next-line no-useless-escape
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

/**
 * Encodes the id (UUID) and the name to a readable slug.
 */
export function slugify({ id, name }: { id: string; name: string }) {
  return `${encodeURIComponent(name.replaceAll(/\s+/g, '-'))}--${encode(id)}`;
}

/**
 * Decodes the slug that is generated above back to the UUID.
 */
export function decodeSlug(slug: string): string | null {
  const splits = slug.split('--');
  if (splits.length !== 2) {
    return null;
  }

  return decode(splits[1]);
}

export { encode, decode };
