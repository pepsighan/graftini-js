import { ComponentMap, EditorStore, useEditorStoreApi } from '@graftini/graft';
import { TextComponentProps } from 'canvasComponents/Text';
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
          [designerState.currentOpenPage]: cleanComponentMap(editorState.componentMap),
        },
      }));
    });
  }, [setState, subscribe]);

  return <></>;
}

/**
 * It removes an temporary states from within the component map that may be used within
 * the editor.
 */
function cleanComponentMap(componentMap: ComponentMap): ComponentMap {
  Object.keys(componentMap).forEach((key) => {
    const component = componentMap[key];

    if (component.type === 'Text') {
      // The editor prop is used to use and manipulate the text editor
      // from anywhere in the designer page.
      // We do not need it in the designer store (which is synced with
      // the backend).
      delete (component.props as TextComponentProps).editor;
    }
  });

  return componentMap;
}
