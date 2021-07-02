import { useComponentRegionStoreApi, useRootScrollStoreApi } from '@graftini/graft';
import { useMotionValue, useTransform } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useDesignerState } from 'store/designer';
import PlainOutline from './PlainOutline';
import ResizeableFrame from './ResizableFrame';

export default function Selection() {
  const componentId = useDesignerState(useCallback((state) => state.selectedComponentId, []));
  return componentId ? <ActualSelection componentId={componentId} /> : null;
}

function ActualSelection({ componentId }) {
  const isResizable = useDesignerState(
    useCallback(
      (state) => state.pages[state.currentOpenPage][componentId].type === 'Box',
      [componentId]
    )
  );

  const posX = useMotionValue(0);
  const posY = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);

  const { scrollX, scrollY } = useScrollPosition();

  const actualX = useTransform([posX, scrollX], subtractScroll);
  const actualY = useTransform([posY, scrollY], subtractScroll);

  const isShown = useSelection({ componentId, posX, posY, width, height });

  return isShown ? (
    <>
      <PlainOutline posX={actualX} posY={actualY} width={width} height={height} />
      {isResizable && (
        <ResizeableFrame
          posX={actualX}
          posY={actualY}
          width={width}
          height={height}
          componentId={componentId}
        />
      )}
    </>
  ) : null;
}

function useSelection({ componentId, posX, posY, width, height }) {
  const [isShown, setIsShown] = useState(false);
  const { getState, subscribe } = useComponentRegionStoreApi();

  useEffect(() => {
    const updateMotion = (state) => {
      if (state) {
        posX.set(state.x);
        posY.set(state.y);
        width.set(state.width);
        height.set(state.height);
        setIsShown(true);
        return;
      }

      posX.set(0);
      posY.set(0);
      width.set(0);
      height.set(0);
      setIsShown(false);
    };

    // Initialize with the first value.
    updateMotion(getState().regionMap[componentId]);
    return subscribe(updateMotion, (state) => state.regionMap[componentId]);
  }, [componentId, getState, height, posX, posY, subscribe, width]);

  return isShown;
}

function useScrollPosition() {
  const { subscribe } = useRootScrollStoreApi();

  const scrollX = useMotionValue(0);
  const scrollY = useMotionValue(0);

  useEffect(() => {
    return subscribe((state) => {
      scrollX.set(state.position.x);
      scrollY.set(state.position.y);
    });
  }, [scrollX, scrollY, subscribe]);

  return { scrollX, scrollY };
}

function subtractScroll([position, scrollPosition]) {
  return position - scrollPosition;
}
