import { Global } from '@emotion/react';
import { rgbaToCss } from '@graftini/bricks';
import { ROOT_NODE_ID } from '@graftini/graft';
import IFrame from 'components/IFrame';
import useMyProjectFromRouter from 'hooks/useMyProjectFromRouter';
import { ProjectIdProvider } from 'hooks/useProjectId';
import NotFound from 'pages/404';
import { useMemo } from 'react';
import { parseComponentMap } from 'store/designer';
import ComponentRender from './ComponentRender';

export default function Preview({ initialRoute }) {
  const { project } = useMyProjectFromRouter();
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
    <ProjectIdProvider value={project.id}>
      <IFrame
        title="Preview"
        style={{
          width: '100%',
          // The height of the nav is substracted, so that the preview does not cause window-wide scroll.
          height: 'calc(100vh - 40px)',
          border: '1px',
          borderColor: 'gray.300',
          // Any content that overflows vertically will have the scrollbar on this box itself.
          overflowY: 'auto',
        }}
      >
        {() => (
          <>
            {rootNode.props.color && (
              <Global
                styles={`
                body {
                  background-color: ${rgbaToCss(rootNode.props.color)};
                }
              `}
              />
            )}

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
    </ProjectIdProvider>
  );
}
