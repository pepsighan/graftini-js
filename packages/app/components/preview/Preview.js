import { Global } from '@emotion/react';
import { rgbaToCss } from '@graftini/bricks';
import { ROOT_NODE_ID } from '@graftini/graft';
import IFrame from 'components/IFrame';
import useMyProjectFromRouter from 'hooks/useMyProjectFromRouter';
import { ProjectIdProvider } from 'hooks/useProjectId';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NotFound from 'pages/404';
import { useMemo } from 'react';
import { parseComponentMap } from 'store/designer';
import { navBarHeight } from 'utils/constants';
import ComponentRender from './ComponentRender';

export default function Preview() {
  const { query } = useRouter();
  const pageId = query.page;

  const { project } = useMyProjectFromRouter();

  const page = useMemo(
    // If page id is provided, then open that page otherwise get the default page.
    () => project.pages.find((it) => (pageId ? it.id === pageId : it.route === '/')),
    [pageId, project.pages]
  );

  if (!page) {
    return <NotFound />;
  }

  const componentMap = parseComponentMap(page.componentMap);
  const rootNode = componentMap[ROOT_NODE_ID];

  const seo = rootNode.props.seo;

  return (
    <ProjectIdProvider value={project.id}>
      <IFrame
        title="Preview"
        style={{
          width: '100%',
          // The height of the nav is substracted, so that the preview does not cause window-wide scroll.
          // Had to subtract 6px more because scrolls appeared otherwise. I checked the source of this
          // additional height on the iframe but could not find.
          height: `calc(100vh - ${navBarHeight + 6}px)`,
          border: 0,
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

            <Head>
              <meta charset="utf-8" />
              <title>
                {seo?.title || 'Unspecified Title'} - Preview - {project.name}
              </title>
              <meta name="description" content={seo?.description || 'Unspecified description.'} />
              <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>

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
