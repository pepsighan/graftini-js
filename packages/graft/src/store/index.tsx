import React, { ReactChild } from 'react';
import { CreateComponentStoreProvider } from './createComponent';
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
          <CreateComponentStoreProvider>
            <RootScrollStoreProvider>{children}</RootScrollStoreProvider>
          </CreateComponentStoreProvider>
        </DraggedOverStoreProvider>
      </ComponentRegionStateProvider>
    </EditorStateProvider>
  );
}
