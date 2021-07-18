import { debounce } from 'lodash-es';
import { useCallback, useEffect } from 'react';
import { useDesignerState, useDesignerStateApi } from 'store/designer';
import { useUpdateProjectDesign } from 'store/projects';

/**
 * Hook that syncs the designer state to the backend. This hook is retained
 * until the project designer page is open. Changing pages does not affect this as
 * all the designs of all the pages are synced every time.
 */
export default function useSyncDesignerStateToBackend({ projectId }) {
  const setIsSaving = useDesignerState(useCallback((state) => state.setIsSaving, []));
  const { subscribe } = useDesignerStateApi();
  const [updateDesign] = useUpdateProjectDesign();

  useEffect(() => {
    // Update every two seconds of the change.
    const debouncedUpdate = debounce(async (pages) => {
      try {
        await updateDesign({
          variables: {
            input: {
              projectId,
              pages: Object.keys(pages).map((pageId) => ({
                pageId,
                componentMap: pages[pageId] ? JSON.stringify({ ...pages[pageId] }) : null,
              })),
            },
          },
        });
      } finally {
        setIsSaving(false);
      }
    }, 2000);

    const onUpdate = async (pages) => {
      // Set the saving status even if its debouncing. Lets the user
      // know that we are actively trying.
      setIsSaving(true);
      await debouncedUpdate(pages);
    };

    return subscribe(onUpdate, (state) => state.pages);
  }, [projectId, setIsSaving, subscribe, updateDesign]);
}
