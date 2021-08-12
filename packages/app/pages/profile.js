import Navigation from 'components/Navigation';
import SEO from 'components/SEO';
import { protectedPage } from 'utils/auth';

export default protectedPage(function Profile() {
  return (
    <>
      <SEO title="Profile" />
      <Navigation />
    </>
  );
});
