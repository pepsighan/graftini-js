import { Text } from '@graftini/bricks';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { TextComponentProps } from './Text';
import { EntityKind, Link } from './textEditor/entities';

export default function TextRender({ content }: TextComponentProps) {
  const { route, query } = useRouter();

  // Inject the `to` links derived from the pageId in the links.
  const transformedContent = useMemo(() => {
    const modified: any = {
      blocks: content.blocks,
    };

    modified.entityMap = Object.keys(content.entityMap)
      .map((key) => {
        const entity = { ...content.entityMap[key] };
        if (entity.type !== EntityKind.Link) {
          // Only link kinds are supported now.
          return null;
        }

        const linkData = entity.data.link as Link;

        let to: string | undefined;

        if (linkData.pageId) {
          // We cannot have the routing system for the preview with actual path, so we will just
          // use the page ids. The actual deployment is able to do it because it knows all about what
          // routes exist based on the files generated.
          to = `${route.replace('[projectId]', query.projectId as string)}?page=${linkData.pageId}`;
        }

        entity.data = {
          link: {
            to: linkData.pageId ? to : undefined,
            href: !linkData.pageId ? linkData.href : undefined,
          },
        };

        return entity;
      })
      .filter((it) => !!it);

    return modified;
  }, [content.blocks, content.entityMap, query.projectId, route]);

  return <Text content={transformedContent} />;
}
