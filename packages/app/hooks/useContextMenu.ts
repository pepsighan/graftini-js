import { useCallback, useState } from 'react';

export default function useContextMenu({ data }: { data?: any } = {}) {
  const [context, setContext] = useState(null);

  const onOpenContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      // Close the context menu is open is clicked twice.
      // This probably means that the user has right clicked again on
      // a separate place on the same surface.
      setContext((context: any) =>
        !context
          ? {
              x: event.clientX,
              y: event.clientY,
              ...(data ?? {}),
            }
          : null
      );
    },
    [data]
  );

  const onCloseContextMenu = useCallback(() => setContext(null), []);

  return { context, onOpenContextMenu, onCloseContextMenu };
}
