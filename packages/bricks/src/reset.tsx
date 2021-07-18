import { Global } from '@emotion/react';
import React from 'react';

/**
 * The goal of this Reset is to make every element look the same and "styleless". This is so that
 * the components can define their own styles and changing the tags should not alter how they look.
 *
 * In essence, this reset makes the tags to have only one purpose i.e. their semantics.
 *
 * The following is adapted from Material UI's CSSBaseline & ResetCSS (https://meyerweb.com/eric/tools/css/reset/).
 **/
export default function Reset() {
  return (
    <Global
      styles={`
        html {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          -webkit-text-size-adjust: 100%;
          box-sizing: border-box;
          // The default font size across browsers.
          font-size: 16px;
        }

        *,
        *::before,
        *::after {
          box-sizing: inherit;
        }

        a, abbr, address, area, article, aside, audio, b, bdi, bdo, blockquote, body, br, button, 
        canvas, caption, cite, code, col, colgroup, command, datalist, dd, del, details, dfn, div, 
        dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, 
        header, hr, html, i, iframe, img, input, ins, kbd, keygen, label, legend, li, main, map, 
        mark, menu, meter, nav, object, ol, optgroup, option, output, p, param, pre, progress, q, 
        rp, rt, ruby, s, samp, section, select, small, source, span, strong, sub, summary, sup, 
        table, tbody, td, textarea, tfoot, th, thead, time, tr, track, u, ul, var, video, wbr {
          margin: 0;
          padding: 0;
          outline: none;
          border: 0;
          display: block;
          background-repeat: no-repeat;
        }
      `}
    />
  );
}
