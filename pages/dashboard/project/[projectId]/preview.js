import PreviewNavigation from 'components/preview/PreviewNavigation';
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
      <PreviewNavigation />
    </>
  );
});
