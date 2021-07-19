import createCache from '@emotion/cache';
import { CacheProvider, Global } from '@emotion/react';
import weakMemoize from '@emotion/weak-memoize';
import { Reset } from '@graftini/bricks';
import Frame, { FrameContextConsumer } from 'react-frame-component';

const cacheKey = 'app';

/**
 * This is an iframe which supports emotion styles.
 */
export default function IFrame({ title, style, children, ...rest }) {
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
    <Frame initialContent={initialContent} style={style} {...rest}>
      <FrameContextConsumer>
        {({ document }) => (
          <CacheProvider value={memoizedCreateCache(document.head)}>
            <Reset />
            <Global
              styles={`
                .frame-content {
                  width: 100vw;
                  height: 100vh;
                }
              `}
            />

            {children()}
          </CacheProvider>
        )}
      </FrameContextConsumer>
    </Frame>
  );
}

// The style cache used for this iframe.
const memoizedCreateCache = weakMemoize((container) => {
  return createCache({
    key: cacheKey,
    container,
  });
});
