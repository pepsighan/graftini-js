import { useTheme } from '@emotion/react';
import { motion } from 'framer-motion';

export default function PlainOutline({ posX, posY, width, height }) {
  const { palette } = useTheme();

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        x: posX,
        y: posY,
        width,
        height,
        border: `1px solid ${palette.primary[400]}`,
        pointerEvents: 'none',
      }}
    />
  );
}
