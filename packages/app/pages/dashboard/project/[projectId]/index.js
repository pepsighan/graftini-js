import Designer from 'components/editor/Designer';
import SEO from 'components/SEO';
import useMyProjectFromRouter from 'hooks/useMyProjectFromRouter';
import NotFound from 'pages/404';
import { DesignerStateProvider } from 'store/designer';
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
    <DesignerStateProvider key={project.id} initialPages={project.pages}>
      <SEO title="Project" />
      <Designer projectId={project.id} />
    </DesignerStateProvider>
  );
});
