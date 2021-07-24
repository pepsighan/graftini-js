import { Box, Button, Card, CardContent, CardHeader, Stack, Typography } from '@material-ui/core';
import Footer from 'components/Footer';
import ILink from 'components/Link';
import Navigation from 'components/Navigation';
import SEO from 'components/SEO';
import Link from 'next/link';
import { navBarHeight } from 'utils/constants';

export default function Pricing() {
  return (
    <>
      <SEO />
      <Navigation />

      <Stack justifyContent="space-between" sx={{ height: `calc(100vh - ${navBarHeight}px)` }}>
        <Stack alignItems="center" sx={{ pt: 8 }}>
          <Typography variant="h3" textAlign="center">
            Pricing
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            fontWeight="normal"
            color="textSecondary"
            sx={{ mt: 1 }}
          >
            Try Graftini without having to put in your card.
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Card sx={{ width: 300 }}>
              <CardHeader
                title="Early Access"
                subheader="To know what Graftini is all about."
                titleTypographyProps={{ variant: 'h6', textAlign: 'center' }}
                subheaderTypographyProps={{ variant: 'body2', textAlign: 'center' }}
                sx={{ bgcolor: 'grey.200' }}
              />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4">
                  $0
                  <Typography
                    variant="body1"
                    component="span"
                    color="textSecondary"
                    sx={{ display: 'inline' }}
                  >
                    /month
                  </Typography>
                </Typography>

                <Typography variant="body1" sx={{ mt: 2 }}>
                  2 Projects
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  10 GB Monthly Bandwidth
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Unlimited Pages
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Unlimited Deploys
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Free Subdomain
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ width: 300 }}>
              <CardHeader
                title="Contact Us"
                subheader="To know more about the plans we offer."
                titleTypographyProps={{ variant: 'h6', textAlign: 'center' }}
                subheaderTypographyProps={{ variant: 'body2', textAlign: 'center' }}
                sx={{ bgcolor: 'grey.200' }}
              />
              <CardContent
                sx={{
                  mt: 8,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Link href="/contact" passHref>
                  <Button component="a" variant="contained" size="medium">
                    Contact Us
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Stack>

          <Typography color="textSecondary" sx={{ mt: 2 }}>
            The early access plan may be updated without prior notice. For more info read our{' '}
            <ILink href="/terms-of-service">terms of service</ILink>.
          </Typography>
        </Stack>

        <Box sx={{ width: '100%', pb: 1, pt: 6 }}>
          <Footer />
        </Box>
      </Stack>
    </>
  );
}
