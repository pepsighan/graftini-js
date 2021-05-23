import { ROOT_NODE_ID } from '@graftini/graft';
import IFrame from 'components/IFrame';
import NotFound from 'pages/404';
import { useProjectFromRouter } from 'pages/dashboard/project/[projectId]';
import { useMemo } from 'react';
import { parseComponentMap } from 'store/designer';
import ComponentRender from './ComponentRender';

export default function Preview({ initialRoute }) {
  const { project } = useProjectFromRouter();
  const page = useMemo(
    () => project.pages.find((it) => it.route === initialRoute),
    [initialRoute, project.pages]
  );

  if (!page) {
    return <NotFound />;
  }

  const componentMap = parseComponentMap(page.componentMap);
  const rootNode = componentMap[ROOT_NODE_ID];

  return (
    <IFrame>
      {() => (
        <>
          {rootNode.childrenNodes.map((componentId) => (
            <ComponentRender
              key={componentId}
              componentId={componentId}
              componentMap={componentMap}
            />
          ))}
        </>
      )}
    </IFrame>
  );
}
