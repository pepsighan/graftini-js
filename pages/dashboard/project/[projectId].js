import Editor from 'components/editor/Editor';
import SEO from 'components/SEO';
import { useRouter } from 'next/router';
import NotFound from 'pages/404';
import { useMemo } from 'react';
import { EditorStateProvider } from 'store/editor';
import { useMyProject } from 'store/projects';
import { protectedPage } from 'utils/auth';
import { decodeSlug } from 'utils/url';

export default protectedPage(function Project() {
  const { query } = useRouter();
  const projectId = useMemo(() => decodeSlug(query.projectId), [query.projectId]);
  const { project, loading } = useMyProject({ projectId });

  if (loading) {
    // TODO: Show some skeleton loading of the editor here.
    return null;
  }

  if (!project) {
    return <NotFound />;
  }

  return (
    <EditorStateProvider key={projectId} initialPages={project.pages}>
      <SEO title="Project" />
      <Editor projectId={projectId} />
    </EditorStateProvider>
  );
});
