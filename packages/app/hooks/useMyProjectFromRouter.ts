import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useMyProject } from 'store/projects';
import { decodeSlug } from 'utils/url';

/**
 * Gets the project referred to by the [projectId] route param.
 */
export default function useMyProjectFromRouter() {
  const { query } = useRouter();
  const projectId = useMemo(() => decodeSlug(query.projectId as string), [query.projectId]);
  return useMyProject({ projectId });
}
