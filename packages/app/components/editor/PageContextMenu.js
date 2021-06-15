import { Box, Button, useDisclosure } from '@chakra-ui/react';
import useMyProjectFromRouter from 'hooks/useMyProjectFromRouter';
import { useCallback, useRef } from 'react';
import { useClickAway } from 'react-use';
import { useMyProject } from 'store/projects';
import DeletePageConfirmation from './DeletePageConfirmation';

export default function PageContextMenu({ context, onClose }) {
  const ref = useRef();
  useClickAway(ref, onClose);

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const onCloseDeleteConfirmation = useCallback(() => {
    onDeleteClose();
    onClose();
  }, [onClose, onDeleteClose]);

  const { project } = useMyProjectFromRouter();
  const page = project.pages.find((it) => it.id === context.pageId);

  return (
    <>
      {!isDeleteOpen && (
        <Box
          ref={ref}
          position="fixed"
          top={`${context.y}px`}
          left={`${context.x}px`}
          zIndex="popover"
          bg="white"
          shadow="md"
          width={200}
          py={1}
          borderRadius="md"
        >
          <Button
            size="sm"
            px={5}
            isFullWidth
            borderRadius="none"
            justifyContent="flex-start"
            fontWeight="normal"
            bg="white"
          >
            Edit
          </Button>
          {page.route !== '/' && (
            <Button
              size="sm"
              px={5}
              isFullWidth
              borderRadius="none"
              justifyContent="flex-start"
              fontWeight="normal"
              bg="white"
              onClick={onDeleteOpen}
            >
              Delete
            </Button>
          )}
        </Box>
      )}

      <DeletePageConfirmation
        isOpen={isDeleteOpen}
        pageId={context.pageId}
        projectId={context.projectId}
        onClose={onCloseDeleteConfirmation}
      />
    </>
  );
}
