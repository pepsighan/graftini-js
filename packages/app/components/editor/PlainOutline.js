import { motion } from 'framer-motion';
import theme from 'utils/theme';

export default function PlainOutline({ posX, posY, width, height }) {
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
        border: `1px solid ${theme.colors.primary[400]}`,
        pointerEvents: 'none',
      }}
    />
  );
}
