import {
  ComponentMap,
  ComponentNode,
  Position,
  ROOT_NODE_ID,
  useEditorStore,
  useEditorStoreApi,
  useOnDelete,
  usePaste,
} from '@graftini/graft';
import { MenuItem } from '@material-ui/core';
import Box from 'canvasComponents/Box';
import { nanoid } from 'nanoid';
import { useCallback } from 'react';
import { useClipboardStore } from 'store/clipboard';
import { useDesignerState } from 'store/designer';
import { ContextMenu, useContextMenu } from './ContextMenu';

export const componentContextMenuId = 'component-context-menu';
export const layerContextMenuId = 'layer-context-menu';

export default function ComponentContextMenu({ id, isCorrectionNeeded, isLayer }) {
  const { onClose } = useContextMenu();

  const componentId = useDesignerState(useCallback((state) => state.selectedComponentId, []));
  const onDeleteClick = useOnDeleteClick({ componentId, onClose });
  const onWrapWithBox = useOnWrapWithBox({ componentId, onClose });

  return (
    <ContextMenu id={id} isCorrectionNeeded={isCorrectionNeeded}>
      {(position: Position) => (
        <>
          {!isLayer && (
            <CopyPaste componentId={componentId} position={position} onClose={onClose} />
          )}
          {componentId !== ROOT_NODE_ID && (
            <>
              <MenuItem onClick={onWrapWithBox}>Wrap with Box</MenuItem>
              <MenuItem onClick={onDeleteClick}>Delete</MenuItem>
            </>
          )}
        </>
      )}
    </ContextMenu>
  );
}

function useOnDeleteClick({ componentId, onClose }) {
  const deleteComponent = useOnDelete();
  const unselectComponent = useDesignerState(useCallback((state) => state.unselectComponent, []));

  return useCallback(() => {
    if (!componentId) {
      return;
    }

    unselectComponent();
    deleteComponent(componentId);
    onClose();
  }, [componentId, deleteComponent, onClose, unselectComponent]);
}

function useOnWrapWithBox({ componentId, onClose }) {
  const selectComponent = useDesignerState(useCallback((state) => state.selectComponent, []));
  const immerSet = useEditorStore(useCallback((state) => state.immerSet, []));

  return useCallback(() => {
    if (!componentId) {
      return;
    }

    let wrappedComponentId: string;

    immerSet((state) => {
      // Get the component which is to be wrapped.
      const component = state.componentMap[componentId];

      // Create a new box component which has no width and height of
      // its own. Its going to stick tight to the component.
      const wrapBoxComponent: ComponentNode = {
        id: nanoid(),
        type: 'Box',
        isCanvas: true,
        childAppendDirection: 'vertical',
        props: {
          ...Box.graftOptions.defaultProps,
          width: 'auto',
          height: 'auto',
        },
        childrenNodes: [],
      };
      wrappedComponentId = wrapBoxComponent.id;

      // Register the new box component.
      state.componentMap[wrapBoxComponent.id] = wrapBoxComponent;

      // Replace the wrapped component with the wrapper box in the parent.
      const parent = state.componentMap[component.parentId!];
      const componentIndex = parent.childrenNodes.indexOf(component.id);
      parent.childrenNodes[componentIndex] = wrapBoxComponent.id;
      wrapBoxComponent.parentId = parent.id;

      // Add the wrapped component to the wrapper box.
      wrapBoxComponent.childrenNodes = [component.id];
      // Replace the parent of the wrapped component with the wrapper.
      component.parentId = wrapBoxComponent.id;

      // Its done.
    });

    // Select the newly created component.
    selectComponent(wrappedComponentId);

    onClose();
  }, [componentId, immerSet, onClose, selectComponent]);
}

function CopyPaste({ componentId, onClose, position }) {
  const { component, copyComponent, flush } = useClipboardStore();
  const { getState: getEditorState } = useEditorStoreApi();
  const pasteComponent = usePaste();
  const deleteComponent = useOnDelete();
  const unselectComponent = useDesignerState(useCallback((state) => state.unselectComponent, []));

  const onCopy = useCallback(() => {
    onClose();

    const copyTree = bundleCopyComponentTree(getEditorState().componentMap, componentId);
    copyComponent(copyTree);
  }, [componentId, copyComponent, getEditorState, onClose]);

  const onCut = useCallback(() => {
    onClose();
    unselectComponent();

    const copyTree = bundleCopyComponentTree(getEditorState().componentMap, componentId);
    copyComponent(copyTree);
    // Delete the component as it has been cut.
    deleteComponent(componentId);
  }, [componentId, copyComponent, deleteComponent, getEditorState, onClose, unselectComponent]);

  const onPaste = useCallback(() => {
    pasteComponent(component, position);

    onClose();
    flush();
  }, [component, flush, onClose, pasteComponent, position]);

  return (
    <>
      <MenuItem disabled={componentId === ROOT_NODE_ID} onClick={onCopy}>
        Copy
      </MenuItem>
      <MenuItem disabled={componentId === ROOT_NODE_ID} onClick={onCut}>
        Cut
      </MenuItem>
      {component && <MenuItem onClick={onPaste}>Paste</MenuItem>}
    </>
  );
}

/**
 * Bundles the children into the tree structure for a copy action while removing each id.
 */
function bundleCopyComponentTree(componentMap: ComponentMap, componentId: string) {
  return {
    ...componentMap[componentId],
    id: null,
    childrenNodes: componentMap[componentId].childrenNodes.map((nodeId) =>
      bundleCopyComponentTree(componentMap, nodeId)
    ),
  };
}
