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
  const bottom = boxBottom > height ? 10 : boxBottom - height;

  return (
    <Box
      position="fixed"
      bottom={bottom}
      right={rightSidebarWidth + 10}
      zIndex="popover"
      {...rest}
    />
  );
}
