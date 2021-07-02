import { Container, Typography } from '@material-ui/core';
import SEO from 'components/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="Not Found" />
      <Container>
        <Typography variant="h4">404</Typography>
        <Typography>Not Found</Typography>
      </Container>
    </>
  );
}
