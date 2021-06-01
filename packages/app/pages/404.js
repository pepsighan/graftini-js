import { Container, Heading } from '@chakra-ui/layout';
import SEO from 'components/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="Not Found" />

      <Container maxW="container.lg">
        <Heading mt={16} textAlign="center" fontWeight="normal">
          404
        </Heading>
        <Heading textAlign="center" fontWeight="normal">
          Not Found
        </Heading>
      </Container>
    </>
  );
}
