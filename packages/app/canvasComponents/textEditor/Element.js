/**
 * The element markup is adopted from the Bricks' TextBody component. They both
 * should look the same at all times.
 */
export default function Element({ attributes, element, children }) {
  if (element.type !== 'paragraph') {
    throw new Error('only paragraphs are supported');
  }

  return <p {...attributes}>{children}</p>;
}
