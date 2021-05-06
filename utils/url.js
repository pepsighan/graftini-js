import { encode } from '@digitalmaas/uuid-base62';

export function slugify({ id, name }) {
  return `${name.replaceAll(/\s+/g, '-')}--${encode(id)}`;
}
