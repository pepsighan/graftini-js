import { Global } from '@emotion/react';
import React from 'react';

/**
 * This is an adaptation from Chakra-UI's Reset.
 *
 * The goal of this Reset is to make every element look the same and "styleless". This is so that
 * the components can define their own styles and changing the tags should not alter how they look.
 *
 * In essence, this reset makes the tags to have only one purpose i.e. their semantics.
 **/
export default function Reset() {
  return (
    <Global
      styles={`
html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  font-family: system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  touch-action: manipulation;
}
body {
  position: relative;
  min-height: 100%;
  font-feature-settings: 'kern';
}
*,
*::before,
*::after {
  border-width: 0;
  border-style: solid;
  box-sizing: border-box;
  background-color: transparent;
  // Any element can have a background defined. So do not repeat them by default.
  background-repeat: no-repeat;
}
main {
  display: block;
}
hr {
  border-top-width: 1px;
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}
pre,
code,
kbd,
samp {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 1em;
}
a {
  color: inherit;
  text-decoration: inherit;
}
abbr[title] {
  border-bottom: none;
  text-decoration: underline;
  -webkit-text-decoration: underline dotted;
  text-decoration: underline dotted;
}
b,
strong {
  font-weight: bold;
}
small {
  font-size: 80%;
}
sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}
sub {
  bottom: -0.25em;
}
sup {
  top: -0.5em;
}
img {
  border-style: none;
}
button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  outline: none;
}
button,
input {
  overflow: visible;
}
button,
select {
  text-transform: none;
}
button::-moz-focus-inner,
[type='button']::-moz-focus-inner,
[type='reset']::-moz-focus-inner,
[type='submit']::-moz-focus-inner {
  border-style: none;
  padding: 0;
}
fieldset {
  padding: 0.35em 0.75em 0.625em;
}
legend {
  box-sizing: border-box;
  color: inherit;
  display: table;
  max-width: 100%;
  padding: 0;
  white-space: normal;
}
progress {
  vertical-align: baseline;
}
textarea {
  verflow: auto;
}
[type='checkbox'],
[type='radio'] {
  box-sizing: border-box;
  padding: 0;
}
[type='number']::-webkit-inner-spin-button,
[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none !important;
}
input[type='number'] {
  -moz-appearance: textfield;
}
[type='search'] {
  -webkit-appearance: textfield;
  outline-offset: -2px;
}
[type='search']::-webkit-search-decoration {
  -webkit-appearance: none !important;
}
::-webkit-file-upload-button {
  -webkit-appearance: button;
  font: inherit;
}
details {
  display: block;
}
summary {
  display: list-item;
}
template {
  display: none;
}
[hidden] {
  display: none !important;
}
body,
blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}
button {
  background: transparent;
  padding: 0;
}
fieldset {
  margin: 0;
  padding: 0;
}
ol,
ul {
  margin: 0;
  padding: 0;
}
textarea {
  resize: vertical;
}
button::-moz-focus-inner {
  border: 0 !important;
}
table {
  border-collapse: collapse;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}
button,
input,
optgroup,
select,
textarea {
  padding: 0;
  line-height: inherit;
  color: inherit;
}
img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block;
}
img,
video {
  max-width: 100%;
  height: auto;
}
[data-js-focus-visible] :focus:not([data-focus-visible-added]) {
  outline: none;
  box-shadow: none;
}
select::-ms-expand {
  display: none;
}
`}
    />
  );
}
