import Preview from 'components/preview/Preview';
import PreviewNavigation from 'components/preview/PreviewNavigation';
import SEO from 'components/SEO';
import NotFound from 'pages/404';
import { protectedPage } from 'utils/auth';
import { useProjectFromRouter } from '.';

export default protectedPage(function ProjectPreview() {
  const { project, loading } = useProjectFromRouter();

  if (loading) {
    // TODO: Show some skeleton loading of the editor here.
    return null;
  }

  if (!project) {
    return <NotFound />;
  }

  return (
    <>
      <SEO title={`Preview - ${project.name}`} />
      <PreviewNavigation projectName={project.name} />
      <Preview initialRoute="/" />
    </>
  );
});
