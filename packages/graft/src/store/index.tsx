import React, { ReactChild } from 'react';
import { DraggedOverStoreProvider } from './draggedOver';
import { ComponentMap, EditorStateProvider } from './editor';
import { ComponentRegionStateProvider } from './regionMap';
import { RootScrollStoreProvider } from './rootScroll';

export type StoreProps = {
  initialState?: ComponentMap;
  children: ReactChild;
};

export default function Store({ initialState, children }: StoreProps) {
  return (
    <EditorStateProvider elementMap={initialState}>
      <ComponentRegionStateProvider>
        <DraggedOverStoreProvider>
          <RootScrollStoreProvider>{children}</RootScrollStoreProvider>
        </DraggedOverStoreProvider>
      </ComponentRegionStateProvider>
    </EditorStateProvider>
  );
}
