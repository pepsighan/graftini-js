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
    <IFrame
      style={{
        width: '100%',
        // The height of the nav is substracted, so that the preview does not cause window-wide scroll.
        height: 'calc(100vh - 49px)',
        border: '1px',
        borderColor: 'gray.300',
        // Any content that overflows vertically will have the scrollbar on this box itself.
        overflowY: 'auto',
      }}
    >
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
