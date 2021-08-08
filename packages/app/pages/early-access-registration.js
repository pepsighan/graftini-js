import { GlobalStyles } from '@material-ui/core';
import SEO from 'components/SEO';

export default function EarlyAccess() {
  return (
    <>
      <SEO title="Early Access Registration" />
      <GlobalStyles
        styles={`
        html { margin: 0; height: 100%; overflow: hidden; } 
        iframe { position: absolute; left:0; right:0; bottom:0; top:0; border: 0; } 
      `}
      />
      <iframe
        title="typeform"
        id="typeform-full"
        width="100%"
        height="100%"
        frameBorder="0"
        allow="camera; microphone; autoplay; encrypted-media;"
        src="https://form.typeform.com/to/hwYugKlL?typeform-medium=embed-snippet"
      />
      <script type="text/javascript" src="https://embed.typeform.com/embed.js"></script>
    </>
  );
}
