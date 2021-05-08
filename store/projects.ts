import { gql, useMutation, useQuery } from '@apollo/client';

type Project = {
  id: string;
  name: string;
};

const QUERY_MY_PROJECTS = gql`
  query GetMyProjects {
    myProjects {
      id
      name
    }
  }
`;

/**
 * Hook to get the users projects.
 */
export function useMyProjects() {
  const { data, ...rest } = useQuery(QUERY_MY_PROJECTS);

  return { myProjects: (data?.myProjects ?? []) as Project[], ...rest };
}

type CreateProjectResponse = {
  createProject: {
    id: string;
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
  return useMutation<CreateProjectResponse, CreateProjectVariables>(
    gql`
      mutation CreateProject($input: NewProject!) {
        createProject(input: $input) {
          id
          name
        }
      }
    `,
    { refetchQueries: [{ query: QUERY_MY_PROJECTS }] }
  );
}

type MyProject = {
  id: string;
  name: string;
  pages: {
    id: string;
    name: string;
    route: string;
    markup: string;
  }[];
  queries: {
    id: string;
    variableName: string;
    gqlAst: string;
  }[];
};

const QUERY_USE_MY_PROJECT = gql`
  query GetMyProjectPages($id: ID!) {
    myProject(id: $id) {
      id
      name
      pages {
        id
        name
        route
        markup
      }
      queries {
        id
        variableName
        gqlAst
      }
    }
  }
`;

/**
 * Hook to get my project in full detail.
 */
export function useMyProject({ projectId }) {
  const { data, ...rest } = useQuery(QUERY_USE_MY_PROJECT, { variables: { id: projectId } });
  return { project: data?.myProject as MyProject | null, ...rest };
}

/**
 * Hook to create a new page in the project.
 */
export function useCreatePage({ projectId }) {
  return useMutation(
    gql`
      mutation CreateProjectPage($input: NewPage!) {
        createPage(input: $input) {
          id
          name
          route
        }
      }
    `,
    {
      refetchQueries: [
        {
          query: QUERY_USE_MY_PROJECT,
          variables: { id: projectId },
        },
      ],
    }
  );
}
