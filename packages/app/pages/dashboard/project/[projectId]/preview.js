import Preview from 'components/preview/Preview';
import PreviewNavigation from 'components/preview/PreviewNavigation';
import SEO from 'components/SEO';
import useMyProjectFromRouter from 'hooks/useMyProjectFromRouter';
import Error from 'pages/_error';
import { protectedPage } from 'utils/auth';

export default protectedPage(function ProjectPreview() {
  const { project, loading } = useMyProjectFromRouter();

  if (loading) {
    // TODO: Show some skeleton loading of the editor here.
    return null;
  }

  if (!project) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <SEO title={`Preview - ${project.name}`} />
      <PreviewNavigation projectName={project.name} />
      <Preview />
    </>
  );
});
