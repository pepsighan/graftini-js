/** @jsxImportSource @emotion/react */
import { Portal } from '@chakra-ui/react';
import { mdiFormatBold, mdiFormatItalic, mdiFormatUnderline } from '@mdi/js';
import { motion, useMotionValue } from 'framer-motion';
import { useContext, useEffect } from 'react';
import { FrameContext } from 'react-frame-component';
import { Editor, Range } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import theme from 'utils/theme';
import FormatButton from './FormatButton';

export default function HoveringToolbar() {
  const editor = useSlate();
  const { window: frameWindow } = useContext(FrameContext);

  const posX = useMotionValue(-10000);
  const posY = useMotionValue(-10000);

  useEffect(() => {
    const { selection } = editor;

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      posX.set(-10000);
      posY.set(-10000);
      return;
    }

    const domSelection = frameWindow.getSelection();
    if (domSelection.rangeCount === 0) {
      return;
    }

    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    posX.set(rect.x);
    posY.set(rect.y - rect.height - 28);
  });

  return (
    <Portal>
      <motion.div
        style={{
          position: 'absolute',
          left: posX,
          top: posY,
        }}
      >
        <div
          css={{
            display: 'flex',
            backgroundColor: 'white',
            boxShadow: theme.shadows.md,
            border: theme.borders['1px'],
            borderColor: theme.colors.gray[200],
            paddingLeft: theme.space[1],
            paddingRight: theme.space[1],
            borderRadius: theme.radii.md,
            marginLeft: 4,
            marginRight: 4,
          }}
        >
          <FormatButton format="bold" icon={mdiFormatBold} />
          <FormatButton format="italic" icon={mdiFormatItalic} />
          <FormatButton format="underlined" icon={mdiFormatUnderline} />
        </div>
      </motion.div>
    </Portal>
  );
}
