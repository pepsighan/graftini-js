import Designer from 'components/editor/Designer';
import SEO from 'components/SEO';
import { useRouter } from 'next/router';
import NotFound from 'pages/404';
import { useMemo } from 'react';
import { DesignerStateProvider } from 'store/designer';
import { useMyProject } from 'store/projects';
import { protectedPage } from 'utils/auth';
import { decodeSlug } from 'utils/url';

export function useProjectFromRouter() {
  const { query } = useRouter();
  const projectId = useMemo(() => decodeSlug(query.projectId), [query.projectId]);
  return useMyProject({ projectId });
}

export default protectedPage(function Project() {
  const { project, loading } = useProjectFromRouter();

  if (loading) {
    // TODO: Show some skeleton loading of the editor here.
    return null;
  }

  if (!project) {
    return <NotFound />;
  }

  return (
    <DesignerStateProvider key={project.id} initialPages={project.pages}>
      <SEO title="Project" />
      <Designer projectId={project.id} />
    </DesignerStateProvider>
  );
});
