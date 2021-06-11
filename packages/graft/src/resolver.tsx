import { createContext, useContext } from 'react';
import { GraftComponent } from './componentTypes';

/**
 * Resolvers is a map of components which are used to render based on the component names
 * in the editor state.
 */
export type ResolverMap = {
  [component: string]: GraftComponent<object>;
};

/**
 * The context to provide resolver map down the tree.
 */
/** @internal */
export const ResolverContext = createContext<ResolverMap>({});

/**
 * Provider to provide a map of resolvers within the editor.
 */
/** @internal */
export const ResolverProvider = ResolverContext.Provider;

/**
 * Hook to get the component referred to by the component name within the editor.
 */
/** @internal */
export function useResolveComponent(component: string): GraftComponent<any> {
  const map = useContext(ResolverContext);

  if (!map[component]) {
    throw new Error(`\`${component}\` is not registered in the Editor resolvers prop.`);
  }

  return map[component];
}
