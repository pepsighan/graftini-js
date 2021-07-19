import { Text } from '@graftini/bricks';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { defaultTextFormValues } from './proseEditor/formFields';
import { MarkKind } from './proseEditor/schema';
import { TextComponentProps } from './Text';

export default function TextRender({ content }: TextComponentProps) {
  const { route, query } = useRouter();

  // We cannot have the routing system for the preview with actual path, so we transform the
  // pageIds into valid internal preview links.
  const derivedContent = useMemo(() => {
    content.content.forEach((para) => {
      if (!para.content) {
        return;
      }

      para.content.forEach((text) => {
        text.marks.forEach((mark) => {
          if (mark.type === MarkKind.Link && mark.attrs.pageId) {
            mark.attrs.to = `${route.replace('[projectId]', query.projectId as string)}?page=${
              mark.attrs.pageId
            }`;
          }
        });
      });
    });

    return content;
  }, [content, query.projectId, route]);

  // For anything that is not styled, they have the default look. The styles
  // that are configured by the user will be overridden by the content itself.
  return <Text {...defaultTextFormValues} content={derivedContent} />;
}
