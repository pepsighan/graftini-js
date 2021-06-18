import { motion, useMotionValue } from 'framer-motion';
import { ROOT_NODE_ID, useHoverSubscriber } from 'graft';
import { useEffect, useState } from 'react';
import theme from 'utils/theme';

export default function HoverOutline({ xCorrection, yCorrection }) {
  const [isVisible, setIsVisible] = useState(false);

  const subscribe = useHoverSubscriber();
  const posX = useMotionValue(0);
  const posY = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);

  useEffect(() => {
    subscribe((state) => {
      // Do not show the outline when on root.
      if (state && state.componentId !== ROOT_NODE_ID) {
        posX.set(state.region.x + xCorrection);
        posY.set(state.region.y + yCorrection);
        width.set(state.region.width);
        height.set(state.region.height);
        setIsVisible(true);
        return;
      }

      posX.set(0);
      posY.set(0);
      width.set(0);
      height.set(0);
      setIsVisible(false);
    });
  });

  return (
    <>
      {isVisible && (
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            x: posX,
            y: posY,
            width,
            height,
            border: `1px solid ${theme.colors.primary[400]}`,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      )}
    </>
  );
}
