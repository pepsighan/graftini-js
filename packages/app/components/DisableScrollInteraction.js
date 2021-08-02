/** @jsxImportSource @emotion/react */

/**
 * We need to disable the scroll using mouse interactions because it works iffy on the canvas.
 * So disabled it altogether all over the place.
 */
export function ScrollTrackHorizontal({ style, ...props }) {
  return (
    <div
      css={{
        ...style,
        right: 2,
        bottom: 2,
        left: 2,
        borderRadius: 3,
        pointerEvents: 'none',
      }}
      {...props}
    />
  );
}

export function ScrollTrackVertical({ style, ...props }) {
  return (
    <div
      css={{
        ...style,
        right: 2,
        bottom: 2,
        top: 2,
        borderRadius: 3,
        pointerEvents: 'none',
      }}
      {...props}
    />
  );
}
