/**
 * The sidebar width that is shown in the editor of a project.
 */
export const rightSidebarWidth = 300;

export type BoxTag =
  | 'div'
  | 'span'
  | 'main'
  | 'button'
  | 'section'
  | 'input'
  | 'select'
  | 'checkbox'
  | 'header'
  | 'footer';

/**
 * The tags that can be used with a drawn Box.
 */
export const boxTags: BoxTag[] = [
  'div',
  'span',
  'button',
  'input',
  'select',
  'checkbox',
  'main',
  'section',
  'header',
  'footer',
];
