import { DimensionSize, Text } from '@graftini/bricks';
import { ROOT_NODE_ID, useEditorStore } from '@graftini/graft';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { normalizeRootChildrenBoxDimension } from './BoxRender';
import { defaultTextFormValues } from './proseEditor/formFields';
import { MarkKind } from './proseEditor/schema';
import { TextComponentProps } from './Text';

export function useTransformTextDimension({ height, width, componentId }): any {
  const isRootParent = useEditorStore(
    useCallback((state) => state.componentMap[componentId].parentId === ROOT_NODE_ID, [componentId])
  );

  // Since the root wrapper has no height of its own, the % values that the user provides
  // are based on the body or viewport. This is how we handle it when deployed.
  // As for the width, % and vw kind of mean the same thing because they are all block components.
  const resolvedHeight = normalizeRootChildrenBoxDimension(height, isRootParent, 'vh');

  return {
    height: resolvedHeight as DimensionSize,
    width,
  };
}

type TextRenderProps = TextComponentProps & {
  componentId: string;
};

export default function TextRender({ tag, content, width, height, componentId }: TextRenderProps) {
  const { route, query } = useRouter();

  // We cannot have the routing system for the preview with actual path, so we transform the
  // pageIds into valid internal preview links.
  const derivedContent = useMemo(() => {
    content.content.forEach((para) => {
      if (!para.content) {
        return;
      }

      para.content.forEach((text) => {
        if (!text.marks) {
          return;
        }

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
  return (
    <Text
      {...defaultTextFormValues}
      tag={tag}
      content={derivedContent}
      {...useTransformTextDimension({ width, height, componentId })}
    />
  );
}
