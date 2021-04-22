/** @jsxImportSource @emotion/react */
import { rgbaToCss } from 'utils/colors';

export default function Root({ backgroundColor, children }) {
  return (
    <div
      css={{
        width: '100%',
        height: '100%',
        backgroundColor: rgbaToCss(backgroundColor),
        // The following padding is provided so that any nested elements do have overflow an overflowing
        // margin when it is set.
        padding: 0.1,
      }}
    >
      {children}
    </div>
  );
}
