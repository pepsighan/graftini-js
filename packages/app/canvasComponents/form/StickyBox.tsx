import { Box, BoxProps } from '@chakra-ui/layout';
import { rightSidebarWidth } from 'components/editor/RightSidebar';
import { useDimensions } from 'hooks/useDimensions';
import { MutableRefObject } from 'react';

type StickBoxProps = {
  stickToRef: MutableRefObject<HTMLElement>;
  heightOfContent: number;
} & BoxProps;

export default function StickyBox({ stickToRef, heightOfContent, ...rest }: StickBoxProps) {
  const stickToDim = useDimensions(stickToRef);
  return (
    <Box
      position="fixed"
      top={(stickToDim?.top ?? 0) - heightOfContent}
      right={rightSidebarWidth + 10}
      zIndex="popover"
      {...rest}
    />
  );
}
