import {
  Box,
  BoxProps,
  DimensionMaxLimit,
  DimensionMinLimit,
  DimensionSize,
} from '@graftini/bricks';
import { ROOT_NODE_ID, useEditorStore } from '@graftini/graft';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useUploadedImage } from 'store/projects';
import { BoxComponentProps } from './Box';

export function useTransformBoxProps({
  imageId,
  height,
  minHeight,
  maxHeight,
  componentId,
  ...rest
}: BoxRenderProps): BoxProps {
  const { image } = useUploadedImage(imageId);
  const isRootParent = useEditorStore(
    useCallback((state) => state.componentMap[componentId].parentId === ROOT_NODE_ID, [componentId])
  );

  // Since the root wrapper has no height of its own, the % values that the user provides
  // are based on the body or viewport. This is how we handle it when deployed.
  // As for the width, % and vw kind of mean the same thing because they are all block components.
  const resolvedHeight = normalizeRootChildrenBoxDimension(height, isRootParent, 'vh');
  const resolvedMinHeight = normalizeRootChildrenBoxDimension(minHeight, isRootParent, 'vh');
  const resolvedMaxHeight = normalizeRootChildrenBoxDimension(maxHeight, isRootParent, 'vh');

  return {
    imageUrl: image?.fileUrl,
    height: resolvedHeight as DimensionSize,
    minHeight: resolvedMinHeight as DimensionMinLimit,
    maxHeight: resolvedMaxHeight as DimensionMaxLimit,
    ...rest,
  };
}

export function normalizeRootChildrenBoxDimension(
  size: DimensionSize | DimensionMinLimit | DimensionMaxLimit,
  isRootParent: boolean,
  unit: 'vh'
): DimensionSize | DimensionMinLimit | DimensionMaxLimit {
  if (isRootParent && typeof size !== 'string' && size.unit === '%') {
    return { ...size, unit };
  }

  return size;
}

type BoxRenderProps = BoxComponentProps & {
  componentId: string;
};

export default function BoxRender({ link, ...rest }: BoxRenderProps) {
  const { route, query } = useRouter();
  const restProps = useTransformBoxProps(rest);

  let to: string | undefined;

  if (link?.pageId) {
    // We cannot have the routing system for the preview with actual path, so we will just
    // use the page ids. The actual deployment is able to do it because it knows all about what
    // routes exist based on the files generated.
    to = `${route.replace('[projectId]', query.projectId as string)}?page=${link.pageId}`;
  }

  return <Box {...restProps} to={to} href={link?.href} />;
}
