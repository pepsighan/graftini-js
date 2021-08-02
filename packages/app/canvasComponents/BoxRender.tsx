import {
  Box,
  BoxProps,
  DimensionMaxLimit,
  DimensionMinLimit,
  DimensionSize,
} from '@graftini/bricks';
import { ROOT_NODE_ID, useComponentId, useEditorStore } from '@graftini/graft';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useUploadedImage } from 'store/projects';
import { BoxComponentProps } from './Box';

export function useTransformBoxProps({
  imageId,
  height,
  width,
  minHeight,
  maxHeight,
  minWidth,
  maxWidth,
  ...rest
}: BoxComponentProps): BoxProps {
  const { image } = useUploadedImage(imageId);
  const componentId = useComponentId();
  const isRootParent = useEditorStore(
    useCallback((state) => state.componentMap[componentId].parentId === ROOT_NODE_ID, [componentId])
  );

  // Since the root wrapper has no height and width of its own, the % values that the user provides
  // are based on the body or viewport. This is how we handle it when deployed.
  const resolvedHeight = normalizeRootChildrenBoxDimension(height, isRootParent, 'vh');
  const resolvedWidth = normalizeRootChildrenBoxDimension(width, isRootParent, 'vw');
  const resolvedMinHeight = normalizeRootChildrenBoxDimension(minHeight, isRootParent, 'vh');
  const resolvedMaxHeight = normalizeRootChildrenBoxDimension(maxHeight, isRootParent, 'vh');
  const resolvedMinWidth = normalizeRootChildrenBoxDimension(minWidth, isRootParent, 'vw');
  const resolvedMaxWidth = normalizeRootChildrenBoxDimension(maxWidth, isRootParent, 'vw');

  return {
    imageUrl: image?.fileUrl,
    height: resolvedHeight as DimensionSize,
    width: resolvedWidth as DimensionSize,
    minHeight: resolvedMinHeight as DimensionMinLimit,
    maxHeight: resolvedMaxHeight as DimensionMaxLimit,
    minWidth: resolvedMinWidth as DimensionMinLimit,
    maxWidth: resolvedMaxWidth as DimensionMaxLimit,
    ...rest,
  };
}

function normalizeRootChildrenBoxDimension(
  size: DimensionSize | DimensionMinLimit | DimensionMaxLimit,
  isRootParent: boolean,
  unit: 'vh' | 'vw'
): DimensionSize | DimensionMinLimit | DimensionMaxLimit {
  if (isRootParent && typeof size !== 'string' && size.unit === '%') {
    return { ...size, unit };
  }

  return size;
}

export default function BoxRender({ link, ...rest }: BoxComponentProps) {
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
