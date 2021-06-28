import React, { ReactNode } from 'react';
import { RootComponent } from './componentTypes';
import { RootOverrideContext } from './context';
import { ResolverMap, ResolverProvider } from './resolver';
import { Root__Graft__Component } from './root';
import Store from './store';
import { ComponentMap } from './store/editor';

/**
 * Props for the editor.
 */
export type EditorProps = {
  /**
   * An initial state of the components drawn on the canvas. This is just an initial state.
   * The editor itself manages the internal state. Hence, once initialized it won't update.
   */
  initialState?: ComponentMap;
  /**
   * Resolvers is a map of components which are used to render based on the editor state. All
   * the component names provided in the editor state should be registered here with the same
   * keys. If some component node cannot be rendered in the state, then it will throw error.
   *
   * Also, there is one hard requirement for the components, that they must allow ref. Components
   * without ref will fail.
   */
  resolvers: ResolverMap;
  /**
   * The children of the editor. This can be anything that you can imagine. The only requirement
   * is that it must have a single Canvas component down the tree.
   */
  children: ReactNode;
  /**
   * An optional override for how the root component should be rendered.
   */
  rootComponentOverride?: RootComponent<any>;
};

/**
 * An editor which stores the state of the elements drawn in the canvas.
 */
export function Editor({ initialState, resolvers, rootComponentOverride, children }: EditorProps) {
  if (!resolvers) {
    throw new Error(
      '`resolvers` prop on Editor is required. We cannot render anything on canvas if ' +
        'there are no resolvers.'
    );
  }

  return (
    <ResolverProvider value={{ ...resolvers, Root__Graft__Component }}>
      <RootOverrideContext.Provider value={rootComponentOverride ?? null}>
        <Store initialState={initialState}>{children}</Store>
      </RootOverrideContext.Provider>
    </ResolverProvider>
  );
}
