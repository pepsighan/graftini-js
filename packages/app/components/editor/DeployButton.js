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
import { DeploymentStatus, useDeployNow, useLiveDeploymentStatus } from 'store/deployment';

export default function DeployButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const toast = useToast();
  const projectId = useProjectId();

  const { deployment, refetch } = useLiveDeploymentStatus({ projectId });

  const [deployNow, { loading }] = useDeployNow();
  const onDeploy = useCallback(async () => {
    try {
      onClose();
      await deployNow({ variables: { projectId } });
      await refetch();
      toast({ description: 'Started the deployment.' });
    } catch (err) {
      toast({ description: 'Deployment failed.', status: 'error' });
    }
  }, [deployNow, onClose, projectId, refetch, toast]);

  return (
    <>
      <Tooltip label="Deploy">
        <DeployStatusButton status={deployment?.status} onOpen={onOpen} isDeploying={loading} />
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

function DeployStatusButton({ status, onOpen, isDeploying }) {
  const isLoading =
    status === DeploymentStatus.Analyzing ||
    status === DeploymentStatus.Building ||
    status === DeploymentStatus.Deploying ||
    status === DeploymentStatus.Initializing;

  return (
    <IconButton
      ml={4}
      icon={<RocketIcon width={20} height={20} />}
      isLoading={isLoading || isDeploying}
      onClick={onOpen}
    />
  );
}
