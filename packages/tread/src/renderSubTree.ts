import { ReactNode } from 'react';

/**
 * Props to the render sub tree.
 */
export type RenderSubTreeProps = {
  children: ReactNode;
};

/**
 * A wrapper for the subtree. This renderer can add styles to this subtree or any
 * other thing however you see fit.
 */
export type RenderSubTree = (props: RenderSubTreeProps) => JSX.Element;
