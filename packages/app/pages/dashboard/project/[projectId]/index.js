import Designer from 'components/editor/Designer';
import SEO from 'components/SEO';
import useMyProjectFromRouter from 'hooks/useMyProjectFromRouter';
import { ProjectIdProvider } from 'hooks/useProjectId';
import { useRouter } from 'next/router';
import Error from 'pages/_error';
import { useCallback, useMemo } from 'react';
import { DesignerStateProvider, useDesignerState } from 'store/designer';
import { protectedPage } from 'utils/auth';
import { decode } from 'utils/url';

export default protectedPage(function Project() {
  const { query } = useRouter();
  const { project, loading } = useMyProjectFromRouter();

  const pageId = useMemo(() => (query.page ? decode(query.page) || null : null), [query.page]);

  if (loading) {
    // TODO: Show some skeleton loading of the editor here.
    return null;
  }

  if (!project) {
    return <Error statusCode={404} />;
  }

  return (
    <ProjectIdProvider value={project.id}>
      <DesignerStateProvider key={project.id} initialPages={project.pages} currentOpenPage={pageId}>
        <ProjectSEO />
        <Designer projectId={project.id} />
      </DesignerStateProvider>
    </ProjectIdProvider>
  );
});

function ProjectSEO() {
  const { project } = useMyProjectFromRouter();
  const pages = project.pages;

  const pageName = useDesignerState(
    useCallback((state) => pages.find((page) => page.id === state.currentOpenPage).name, [pages])
  );

  return <SEO title={`${project.name} - ${pageName}`} />;
}
