import {
  Badge,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Popover,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { RocketIcon } from '@modulz/radix-icons';
import AsyncButton from 'components/AsyncButton';
import { useProjectId } from 'hooks/useProjectId';
import { useCallback, useState } from 'react';
import { useLocalStorage } from 'react-use';
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

  const [viewState, setViewState] = useLocalStorage('graftini-deployment-status-viewed', '{}', {
    raw: false,
    serializer: (value) => JSON.stringify(value),
    deserializer: (value) => JSON.parse(value),
  });
  const isViewed = viewState[projectId];
  const statusColor = deploymentStatusColor(isViewed, deployment?.status);

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
  const onOpen = useCallback(
    (event) => {
      setPop(event.currentTarget);
      setViewState((state) => ({
        ...state,
        [projectId]: true,
      }));
    },
    [projectId, setViewState]
  );
  const onClose = useCallback(() => setPop(null), []);

  return (
    <>
      <Tooltip title="Deploy">
        <IconButton onClick={onOpen}>
          <Badge variant="dot" color={statusColor} invisible={!statusColor}>
            {isDeploying || isStartingDeployment ? <CircularProgress size={18} /> : <RocketIcon />}
          </Badge>
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

function deploymentStatusColor(isViewed, status) {
  if (isViewed) {
    return undefined;
  }

  switch (status) {
    case DeploymentStatus.Ready:
      return 'success';
    case DeploymentStatus.Error:
      return 'error';
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
