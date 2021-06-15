import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { useCallback, useRef } from 'react';
import { useDesignerState } from 'store/designer';
import { useDeletePage } from 'store/projects';

export default function DeletePageConfirmation({ projectId, pageId, isOpen, onClose }) {
  const [deletePage, { loading }] = useDeletePage({ projectId });
  const deletePageFromDesigner = useDesignerState(useCallback((state) => state.deletePage, []));

  const cancelRef = useRef();

  const onDelete = useCallback(async () => {
    await deletePage({ variables: { projectId, pageId } });
    deletePageFromDesigner(pageId);
    onClose();
  }, [deletePage, deletePageFromDesigner, onClose, pageId, projectId]);

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogBody pt={4}>Are you sure you want to delete this page?</AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onDelete} ml={3} isLoading={loading}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
