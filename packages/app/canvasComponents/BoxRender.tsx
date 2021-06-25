import { Box } from '@graftini/bricks';
import { useProjectId } from 'hooks/useProjectId';
import { useMyProject } from 'store/projects';
import { BoxComponentProps } from './Box';

export default function BoxRender({ link, ...rest }: BoxComponentProps) {
  const projectId = useProjectId();
  const { project } = useMyProject({ projectId });

  let to: string | undefined;

  // Get the relative link if the link is a page.
  if (link?.pageId) {
    const page = (project?.pages ?? []).find((it) => it.id === link.pageId);
    to = page?.route;
  }

  return <Box {...rest} to={to} href={link?.href} />;
}
