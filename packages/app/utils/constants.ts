/**
 * The sidebar width that is shown in the editor of a project.
 */
export const leftSideBarWidth = 250;
export const rightSidebarWidth = 300;
export const navBarHeight = 48;

export type BoxTag =
  | 'div'
  | 'span'
  | 'main'
  | 'button'
  | 'section'
  | 'header'
  | 'footer'
  | 'nav'
  | 'aside'
  | 'article'
  | 'address';

/**
 * The tags that can be used with a drawn Box.
 */
export const boxTags: BoxTag[] = [
  'div',
  'span',
  'button',
  'main',
  'section',
  'header',
  'footer',
  'nav',
  'aside',
  'article',
  'address',
];

/**
 * A route regex which has a compulsory starting `/` and optional trailing `/`.
 * The route path sections defined by text between `/` can be alphanumeric, -, _ and (.).
 */
export const routeRegex = /^(\/|(\/[a-zA-Z0-9-_.]+)+\/?)$/;
