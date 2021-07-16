import { Box, BoxProps } from '@graftini/bricks';
import { useRouter } from 'next/router';
import { useUploadedImage } from 'store/projects';
import { BoxComponentProps } from './Box';

export function useTransformBoxProps({ imageId, ...rest }: BoxComponentProps): BoxProps {
  const { image } = useUploadedImage(imageId);
  return { imageUrl: image?.fileUrl, ...rest };
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
