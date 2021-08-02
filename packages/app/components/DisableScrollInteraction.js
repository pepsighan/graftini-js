/** @jsxImportSource @emotion/react */

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
