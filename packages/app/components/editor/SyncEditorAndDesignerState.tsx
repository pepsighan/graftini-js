import { EditorStore, useEditorStoreApi } from '@graftini/graft';
import { useEffect } from 'react';
import { useDesignerStateApi } from 'store/designer';

/**
 * This renderless component syncs the internal state of editor and the designer in that direction.
 */
export default function SyncEditorAndDesignerState() {
  const { subscribe } = useEditorStoreApi();
  const { setState } = useDesignerStateApi();

  useEffect(() => {
    return subscribe((editorState: EditorStore) => {
      setState((designerState) => ({
        ...designerState,
        pages: {
          ...designerState.pages,
          [designerState.currentOpenPage]: editorState.componentMap,
        },
      }));
    });
  }, [setState, subscribe]);

  return <></>;
}
