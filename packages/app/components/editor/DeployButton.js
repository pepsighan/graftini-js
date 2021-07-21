import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Popover,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core';
import { RocketIcon } from '@modulz/radix-icons';
import AsyncButton from 'components/AsyncButton';
import { useProjectId } from 'hooks/useProjectId';
import { useCallback, useState } from 'react';
import { DeploymentStatus, useDeployNow, useLiveDeploymentStatus } from 'store/deployment';
import { useMyProject } from 'store/projects';

const activelyDeploying = [
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
  const statusColor = useDeploymentStatusColor(deployment);

  const [deployNow, { loading: isStartingDeployment }] = useDeployNow();
  const onDeploy = useCallback(async () => {
    try {
      await deployNow({ variables: { projectId } });
    } finally {
      await refetch();
    }
  }, [deployNow, projectId, refetch]);

  const isDeploying = activelyDeploying.includes(deployment?.status);

  const [pop, setPop] = useState(null);
  const onOpen = useCallback((event) => setPop(event.currentTarget), []);
  const onClose = useCallback(() => setPop(null), []);

  return (
    <>
      <Tooltip title="Deploy">
        <IconButton onClick={onOpen}>
          {isDeploying || isStartingDeployment ? (
            <CircularProgress size={18} />
          ) : (
            <RocketIcon color={statusColor} />
          )}
        </IconButton>
      </Tooltip>

      <Popover
        open={!!pop}
        anchorEl={pop}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        sx={{ mr: 2 }}
      >
        <DeployPopoverContent
          onDeploy={onDeploy}
          deployment={deployment}
          isDeploying={isDeploying || isStartingDeployment}
        />
      </Popover>
    </>
  );
}

function DeployPopoverContent({ deployment, onDeploy, isDeploying }) {
  const projectId = useProjectId();
  const { project } = useMyProject({ projectId });

  return (
    <Box sx={{ px: 2, py: 1.5, width: 250 }}>
      {!isDeploying && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          {finalDeploymentStatus(deployment)}
        </Typography>
      )}

      {isDeploying && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          Your app is currently being deployed.
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: project.appUrl ? 'space-between' : 'flex-end' }}>
        {project.appUrl && (
          <Button
            component="a"
            href={`https://${project.appUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
          >
            Open App
          </Button>
        )}

        <AsyncButton variant="contained" isLoading={isDeploying} onClick={onDeploy} size="small">
          Deploy Now
        </AsyncButton>
      </Box>
    </Box>
  );
}

function useDeploymentStatusColor(deployment) {
  const { palette } = useTheme();

  if (!deployment) {
    return undefined;
  }

  const createdAt = new Date(deployment.createdAt);
  const now = new Date();
  const diffMin = (now.getTime() - createdAt.getTime()) / (1000 * 60);

  // Do not show the status color if the deployment began 20 minutes ago.
  // The color is now obsolete to consider.
  if (diffMin > 20) {
    return undefined;
  }

  switch (deployment.status) {
    case DeploymentStatus.Ready:
      return palette.success.main;
    case DeploymentStatus.Error:
      return palette.error.main;
    default:
      return undefined;
  }
}

function finalDeploymentStatus(deployment) {
  if (!deployment) {
    return 'The app has never been deployed.';
  }

  switch (deployment.status) {
    case DeploymentStatus.Canceled:
      return 'The deployment was cancelled.';
    case DeploymentStatus.Error:
      return 'The deployment failed.';
    case DeploymentStatus.Ready:
      return 'The deployment succeeded.';
    default:
      return '';
  }
}
