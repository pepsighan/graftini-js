import { createContext, PropsWithChildren, useCallback, useContext, useRef } from 'react';
import { useDesignerState } from 'store/designer';

export const TextEditorContext = createContext(null);

export function TextEditorProvider({ children }: PropsWithChildren<{}>) {
  const ref = useRef(null);
  const onFocus = useRetainFocus(ref);

  return (
    <div data-id="focus-like-me" onFocusCapture={onFocus}>
      <TextEditorContext.Provider value={ref}>{children}</TextEditorContext.Provider>
    </div>
  );
}

export function useTextEditorRef() {
  return useContext(TextEditorContext);
}

/**
 * This hook tries to retain the focus on the text editor even when the cursor may have
 * clicked outside the editor.
 *
 * It won't retain focus if the current selected component in the canvas has changed.
 */
function useRetainFocus(ref) {
  const isEditing = useDesignerState(
    useCallback((state) => !!state.selectedComponentId && state.isTextEditingEnabled, [])
  );

  return useCallback(() => {
    console.log('focus clicked');
    if (!ref.current || !isEditing) {
      return;
    }

    ref.current.focus();
  }, [isEditing, ref]);
}
