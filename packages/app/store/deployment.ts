import { gql, useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

/**
 * Hook to deploy the project now.
 */
export function useDeployNow() {
  return useMutation(gql`
    mutation DeployNow($projectId: ID!) {
      deployProject(projectId: $projectId) {
        id
      }
    }
  `);
}

export enum DeploymentStatus {
  Initializing = 'INITIALIZING',
  Analyzing = 'ANALYZING',
  Building = 'BUILDING',
  Deploying = 'DEPLOYING',
  Ready = 'READY',
  Error = 'ERROR',
  Canceled = 'CANCELED',
}

/**
 * Hook to get the current deployment status of the project.
 */
export function useLiveDeploymentStatus({ projectId }) {
  const [isPolling, setIsPolling] = useState(true);

  const { data, startPolling, stopPolling, ...rest } = useQuery(
    gql`
      query GetDeploymentStatus($projectId: ID!) {
        myLastDeployment(projectId: $projectId) {
          id
          status
        }
      }
    `,
    { variables: { projectId }, pollInterval: 5000 }
  );

  const deployment = data?.myLastDeployment;
  const status = deployment?.status;

  useEffect(() => {
    if (
      !status ||
      status === DeploymentStatus.Error ||
      status === DeploymentStatus.Canceled ||
      status === DeploymentStatus.Ready
    ) {
      // The status has reached the final state.
      // No further polling required.
      stopPolling();
      setIsPolling(false);
      return;
    }

    // If the status is something else and it is not being polled
    // then start polling again.
    if (!isPolling) {
      startPolling(5000);
    }
  }, [isPolling, startPolling, status, stopPolling]);

  return { deployment, ...rest };
}
