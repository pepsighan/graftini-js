import { Typography } from '@material-ui/core';
import Navigation from 'components/Navigation';
import SEO from 'components/SEO';

export default function Home() {
  return (
    <>
      <SEO />
      <Navigation />
      <Typography variant="h4" textAlign="center" mt={8}>
        Login
      </Typography>
    </>
  );
}
