import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import weakMemoize from '@emotion/weak-memoize';
import { Reset } from '@graftini/bricks';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import { useCheckCursorOnIFrame } from '@graftini/graft';

const cacheKey = 'example';

export default function IFrame({ title, style, children }) {
  const initialContent = `
<!DOCTYPE html>
<html>
  <head data-emotion-cache-key="${cacheKey}">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
  </head>
  <body>
    <div></div>
  </body>
</html>
`;

  return (
    <Frame initialContent={initialContent} style={style} {...useCheckCursorOnIFrame()}>
      <FrameContextConsumer>
        {({ document }) => (
          <CacheProvider value={memoizedCreateCache(document.head)}>
            <Reset />
            {children()}
          </CacheProvider>
        )}
      </FrameContextConsumer>
    </Frame>
  );
}

const memoizedCreateCache = weakMemoize((container) => {
  return createCache({
    key: cacheKey,
    container,
  });
});
