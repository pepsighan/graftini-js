import { gql, useMutation, useQuery } from '@apollo/client';

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

type CreateProjectResponse = {
  createProject: {
    id: number;
    name: string;
  };
};

type CreateProjectVariables = {
  input: {
    name: string;
  };
};

/**
 * Hook to create a new project.
 */
export function useCreateProject() {
  return useMutation<CreateProjectResponse, CreateProjectVariables>(gql`
    mutation CreateProject($input: NewProject!) {
      createProject(input: $input) {
        id
        name
      }
    }
  `);
}
