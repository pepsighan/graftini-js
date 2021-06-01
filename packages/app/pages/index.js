import { Heading } from '@chakra-ui/layout';
import { Global } from '@emotion/react';
import Navigation from 'components/Navigation';
import SEO from 'components/SEO';

export default function Home() {
  return (
    <>
      <SEO />
      <Navigation isTransparent />
      <Global styles={`body { background-color: #202020; }`} />
      <Heading fontWeight={300} px={4} textAlign="center" color="gray.300" mt={64}>
        Create dynamic websites without writing a line of code.
      </Heading>
    </>
  );
}
