/**
 * The leaf markup is adopted from the Bricks' TextBody component. They both
 * should look the same at all times.
 */
export default function Leaf({ attributes, children }) {
  return <span {...attributes}>{children}</span>;
}
