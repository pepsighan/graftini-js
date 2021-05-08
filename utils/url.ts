import { encode, decode } from '@digitalmaas/uuid-base62';

/**
 * Encodes the id (UUID) and the name to a readable slug.
 */
export function slugify({ id, name }: { id: string; name: string }) {
  return `${name.replaceAll(/\s+/g, '-')}--${encode(id)}`;
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
