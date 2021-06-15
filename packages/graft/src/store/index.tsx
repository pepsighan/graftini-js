import React, { ReactNode } from 'react';
import { CreateComponentStoreProvider } from './createComponent';
import { DraggedOverStoreProvider } from './draggedOver';
import { ComponentMap, EditorStateProvider } from './editor';
import { HistoryStoreProvider } from './history';
import { HoverStoreProvider } from './hover';
import { ComponentRegionStateProvider } from './regionMap';
import { RootScrollStoreProvider } from './rootScroll';

export type StoreProps = {
  initialState?: ComponentMap;
  children: ReactNode;
};

export default function Store({ initialState, children }: StoreProps) {
  return (
    <EditorStateProvider elementMap={initialState}>
      <ComponentRegionStateProvider>
        <DraggedOverStoreProvider>
          <CreateComponentStoreProvider>
            <HoverStoreProvider>
              <HistoryStoreProvider>
                <RootScrollStoreProvider>{children}</RootScrollStoreProvider>
              </HistoryStoreProvider>
            </HoverStoreProvider>
          </CreateComponentStoreProvider>
        </DraggedOverStoreProvider>
      </ComponentRegionStateProvider>
    </EditorStateProvider>
  );
}
