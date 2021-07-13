import { useCallback, useState } from 'react';

export default function useContextMenu({ data }: { data?: any } = {}) {
  const [context, setContext] = useState(null);

  const onOpenContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      setContext({
        x: event.clientX,
        y: event.clientY,
        ...(data ?? {}),
      });
    },
    [data]
  );

  const onCloseContextMenu = useCallback(() => setContext(null), []);

  return { context, onOpenContextMenu, onCloseContextMenu };
}
