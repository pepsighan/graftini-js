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
import { forwardRef, useCallback, useEffect, useRef } from 'react';
import { usePrevious } from 'react-use';
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
      toast({ description: 'Started the deployment.', status: 'info' });
      await deployNow({ variables: { projectId } });
      await refetch();
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

const loadingState = [
  DeploymentStatus.Analyzing,
  DeploymentStatus.Building,
  DeploymentStatus.Deploying,
  DeploymentStatus.Initializing,
];

const DeployStatusButton = forwardRef(({ status, onOpen, isDeploying }, ref) => {
  const isLoading = loadingState.includes(status);

  const toast = useToast();
  const previousStatus = usePrevious(status);

  // Show a toast when the deployment transitions to a final state.
  useEffect(() => {
    if (loadingState.includes(previousStatus)) {
      if (status === DeploymentStatus.Canceled) {
        toast({ description: 'Deployment was cancelled.', status: 'info' });
        return;
      }

      if (status === DeploymentStatus.Error) {
        toast({ description: 'Deployment failed.', status: 'error' });
        return;
      }

      if (status === DeploymentStatus.Ready) {
        toast({ description: 'Your app is now deployed.', status: 'success' });
      }
    }
  }, [previousStatus, status, toast]);

  return (
    <IconButton
      ref={ref}
      ml={4}
      icon={<RocketIcon width={20} height={20} />}
      isLoading={isLoading || isDeploying}
      onClick={onOpen}
    />
  );
});
