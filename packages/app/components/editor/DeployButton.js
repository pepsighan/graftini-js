import { IconButton, Tooltip } from '@material-ui/core';
import { RocketIcon } from '@modulz/radix-icons';
import { useProjectId } from 'hooks/useProjectId';
import { useCallback } from 'react';
import { DeploymentStatus, useDeployNow, useLiveDeploymentStatus } from 'store/deployment';

const loadingState = [
  DeploymentStatus.Queued,
  DeploymentStatus.Initializing,
  DeploymentStatus.Analyzing,
  DeploymentStatus.Building,
  DeploymentStatus.Uploading,
  DeploymentStatus.Deploying,
];

export default function DeployButton() {
  const projectId = useProjectId();
  const { deployment, refetch } = useLiveDeploymentStatus({ projectId });

  const [deployNow, { loading }] = useDeployNow();
  const onDeploy = useCallback(async () => {
    await deployNow({ variables: { projectId } });
    await refetch();
  }, [deployNow, projectId, refetch]);

  const isLoading = loadingState.includes(deployment?.status);

  return (
    <Tooltip title="Deploy">
      <IconButton isLoading={isLoading || loading} onClick={onDeploy}>
        <RocketIcon />
      </IconButton>
    </Tooltip>
  );
}
