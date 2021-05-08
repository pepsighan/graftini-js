import { Heading } from '@chakra-ui/layout';
import Navigation from 'components/Navigation';
import SEO from 'components/SEO';

export default function Home() {
  return (
    <>
      <SEO />
      <Navigation />
      <Heading fontWeight="normal" px={4} textAlign="center" mt={16}>
        Create dynamic websites without writing a line of code.
      </Heading>
    </>
  );
}
