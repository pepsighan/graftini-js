import { debounce } from 'lodash-es';
import { useEffect } from 'react';
import { useDesignerStateApi } from 'store/designer';
import { useUpdateProjectDesign } from 'store/projects';

/**
 * Hook that syncs the designer state to the backend. This hook is retained
 * until the project designer page is open. Changing pages does not affect this as
 * all the designs of all the pages are synced every time.
 */
export default function useSyncDesignerStateToBackend({ projectId }) {
  const { subscribe } = useDesignerStateApi();
  const [updateDesign] = useUpdateProjectDesign();

  useEffect(() => {
    // Update every two seconds.
    const debouncedUpdate = debounce(async (pages) => {
      await updateDesign({
        variables: {
          input: {
            projectId,
            pages: Object.keys(pages).map((pageId) => ({
              pageId,
              componentMap: pages[pageId]
                ? // Cleanup any deleted component nodes before saving them to
                  // backend.
                  JSON.stringify({ ...pages[pageId] })
                : null,
            })),
          },
        },
      });
    }, 2000);

    return subscribe(debouncedUpdate, (state) => state.pages);
  }, [projectId, subscribe, updateDesign]);
}
