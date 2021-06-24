import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
  Button,
  IconButton,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { RocketIcon } from '@modulz/radix-icons';
import { useRef } from 'react';

export default function DeployButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  return (
    <>
      <Tooltip label="Deploy">
        <IconButton ml={4} icon={<RocketIcon width={20} height={20} />} onClick={onOpen} />
      </Tooltip>

      <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogBody pt={4}>Do you want to deploy the current design?</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="primary" ml={3}>
              Deploy Now
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
