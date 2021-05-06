import { gql, useQuery } from '@apollo/client';

type Project = {
  id: number;
  name: string;
};

/**
 * Hook to get the users projects.
 */
export function useMyProjects() {
  const { data, ...rest } = useQuery(gql`
    query GetMyProjects {
      myProjects {
        id
        name
      }
    }
  `);

  return { myProjects: (data?.myProjects ?? []) as Project[], ...rest };
}
