import NotFound from 'pages/404';
import { useProjectFromRouter } from 'pages/dashboard/project/[projectId]';
import { useMemo } from 'react';

export default function Preview({ initialRoute }) {
  const { project } = useProjectFromRouter();
  const page = useMemo(
    () => project.pages.find((it) => it.route === initialRoute),
    [initialRoute, project.pages]
  );

  if (!page) {
    return <NotFound />;
  }

  return <>{initialRoute}</>;
}
