import { Box } from '@graftini/bricks';
import { useRouter } from 'next/router';
import { BoxComponentProps } from './Box';

export default function BoxRender({ link, ...rest }: BoxComponentProps) {
  const { route, query } = useRouter();

  let to: string | undefined;

  if (link?.pageId) {
    // We cannot have the routing system for the preview with actual path, so we will just
    // use the page ids. The actual deployment is able to do it because it knows all about what
    // routes exist based on the files generated.
    to = `${route.replace('[projectId]', query.projectId as string)}?page=${link.pageId}`;
  }

  return <Box {...rest} to={to} href={link?.href} />;
}
