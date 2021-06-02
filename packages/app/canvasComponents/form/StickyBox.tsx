import { Box, BoxProps } from '@chakra-ui/layout';
import { rightSidebarWidth } from 'components/editor/RightSidebar';
import { useDimensions } from 'hooks/useDimensions';
import { MutableRefObject } from 'react';
import { useWindowSize } from 'react-use';

type StickBoxProps = {
  stickToRef: MutableRefObject<HTMLElement>;
  heightOfContent: number;
} & BoxProps;

export default function StickyBox({ stickToRef, heightOfContent, ...rest }: StickBoxProps) {
  const stickToDim = useDimensions(stickToRef);
  const { height } = useWindowSize();

  const boxBottom = stickToDim.top + heightOfContent;

  // If the content is well below the window height then pull it up.
  const top = boxBottom > height ? height - heightOfContent - 10 : stickToDim.top;

  return (
    <Box position="fixed" top={top} right={rightSidebarWidth + 10} zIndex="popover" {...rest} />
  );
}
