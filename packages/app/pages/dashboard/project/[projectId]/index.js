import Designer from 'components/editor/Designer';
import SEO from 'components/SEO';
import useMyProjectFromRouter from 'hooks/useMyProjectFromRouter';
import { ProjectIdProvider } from 'hooks/useProjectId';
import NotFound from 'pages/404';
import { useCallback } from 'react';
import { DesignerStateProvider, useDesignerState } from 'store/designer';
import { protectedPage } from 'utils/auth';

export default protectedPage(function Project() {
  const { project, loading } = useMyProjectFromRouter();

  if (loading) {
    // TODO: Show some skeleton loading of the editor here.
    return null;
  }

  if (!project) {
    return <NotFound />;
  }

  return (
    <ProjectIdProvider value={project.id}>
      <DesignerStateProvider key={project.id} initialPages={project.pages}>
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
