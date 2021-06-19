import { DimensionSize } from 'bricks';
import { useEditor } from 'graft';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export function transformToRawWidth(width: DimensionSize) {
  return {
    size: ((width as any)?.size ?? 100).toString(),
    unit: (width as any)?.unit ?? '%',
    toggle: typeof width === 'string' ? width : null,
  };
}

export function transformToRawHeight(height: DimensionSize) {
  return {
    size: ((height as any)?.size ?? 200).toString(),
    unit: (height as any)?.unit ?? 'px',
    toggle: typeof height === 'string' ? height : null,
  };
}

export default function SyncResize({ componentId }: { componentId: string }) {
  const { subscribe } = useEditor();
  const { setValue } = useFormContext();

  useEffect(() => {
    const unsubWidth = subscribe(
      (width) => setValue('widthRaw', transformToRawWidth(width as DimensionSize)),
      (state) => state[componentId].props.width
    );

    const unsubHeight = subscribe(
      (height) => setValue('heightRaw', transformToRawHeight(height as DimensionSize)),
      (state) => state[componentId].props.height
    );

    return () => {
      unsubWidth();
      unsubHeight();
    };
  }, [componentId, setValue, subscribe]);

  return <></>;
}
