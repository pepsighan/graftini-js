import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { useCallback, useRef } from 'react';
import { useDeleteProject } from 'store/projects';

export default function DeleteProjectConfirmation({ projectId, children, ...props }) {
  const [deleteProject, { loading }] = useDeleteProject();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const onDelete = useCallback(async () => {
    await deleteProject({ variables: { projectId } });
    onClose();
  }, [deleteProject, onClose, projectId]);

  return (
    <>
      <Button onClick={onOpen} {...props}>
        {children}
      </Button>

      <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogBody pt={4}>Are you sure you want to delete this project?</AlertDialogBody>
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
    </>
  );
}
