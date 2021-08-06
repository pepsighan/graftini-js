import { gql, useQuery } from '@apollo/client';

/**
 * Hook to get the project templates.
 */
export function useProjectTemplates() {
  const { data, ...rest } = useQuery(gql`
    query GetProjectTemplates {
      templates {
        id
        name
        snapshot
        fileUrl
      }
    }
  `);

  return { templates: data?.templates ?? [], ...rest };
}
