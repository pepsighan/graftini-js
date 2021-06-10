import { gql, useMutation, useQuery } from '@apollo/client';
import { useCallback } from 'react';
import { parseComponentMap, useDesignerState } from './designer';

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
  pages: ProjectPage[];
  queries: Query[];
};

export type ProjectPage = {
  id: string;
  name: string;
  route: string;
  componentMap?: string;
};

export type Query = {
  id: string;
  variableName: string;
  gqlAst: string;
};

const QUERY_MY_PROJECT = gql`
  query GetMyProjectPages($id: ID!) {
    myProject(id: $id) {
      id
      name
      pages {
        id
        name
        route
        componentMap
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
  const { data, ...rest } = useQuery(QUERY_MY_PROJECT, { variables: { id: projectId } });
  return { project: data?.myProject as MyProject | null, ...rest };
}

/**
 * Hook to create a new page in the project.
 */
export function useCreatePage({ projectId }) {
  const updatePageDesign = useDesignerState(useCallback((state) => state.updatePageDesign, []));

  return useMutation(
    gql`
      mutation CreateProjectPage($input: NewPage!) {
        createPage(input: $input) {
          id
          componentMap
        }
      }
    `,
    {
      refetchQueries: [
        {
          query: QUERY_MY_PROJECT,
          variables: { id: projectId },
        },
      ],
      onCompleted: (data) => {
        // Add this page so that the UI can edit it.
        updatePageDesign(data.createPage.id, parseComponentMap(data.createPage.componentMap));
      },
    }
  );
}

/**
 * Hook to create a query for a project.
 */
export function useCreateQuery({ projectId }) {
  return useMutation(
    gql`
      mutation CreateProjectQuery($input: NewGraphQLQuery!) {
        createQuery(input: $input) {
          id
        }
      }
    `,
    {
      refetchQueries: [
        {
          query: QUERY_MY_PROJECT,
          variables: { projectId },
        },
      ],
    }
  );
}

/**
 * Hook to delete a query of a project.
 */
export function useDeleteQuery({ projectId }) {
  return useMutation(
    gql`
      mutation DeleteProjectQuery($projectId: ID!, $queryId: ID!) {
        deleteQuery(projectId: $projectId, queryId: $queryId) {
          id
        }
      }
    `,
    {
      refetchQueries: [
        {
          query: QUERY_MY_PROJECT,
          variables: { projectId },
        },
      ],
    }
  );
}

/**
 * Hook to update the project design for all the pages.
 */
export function useUpdateProjectDesign() {
  return useMutation(gql`
    mutation UpdateProjectDesign($input: UpdateProjectDesign!) {
      updateProjectDesign(input: $input) {
        id
        pages {
          id
          componentMap
        }
      }
    }
  `);
}
