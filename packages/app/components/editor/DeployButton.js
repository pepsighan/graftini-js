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
  useToast,
} from '@chakra-ui/react';
import { RocketIcon } from '@modulz/radix-icons';
import { useProjectId } from 'hooks/useProjectId';
import { useCallback, useRef } from 'react';
import { useDeployNow } from 'store/deployment';

export default function DeployButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const toast = useToast();
  const projectId = useProjectId();

  const [deployNow] = useDeployNow();
  const onDeploy = useCallback(async () => {
    try {
      await deployNow({ variables: { projectId } });
      onClose();
      toast({ description: 'Started the deployment.' });
    } catch (err) {
      toast({ description: 'Deployment failed.', status: 'error' });
    }
  }, [deployNow, onClose, projectId, toast]);

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
            <Button colorScheme="primary" ml={3} onClick={onDeploy}>
              Deploy Now
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
