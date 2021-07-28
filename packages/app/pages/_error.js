import { Button, Stack, Typography } from '@material-ui/core';
import SEO from 'components/SEO';
import Link from 'next/link';

const errorText = {
  404: 'We looked everywhere but could not find what you wanted.',
  500: 'Our servers may have melted. Please give us time to fix it.',
};

const errorEmoji = {
  404: '😶',
  500: '😭',
};
const altEmoji = '😰';

export default function Error({ statusCode }) {
  return (
    <>
      <SEO title={statusCode ? `Error ${statusCode}` : 'Aww! Shit'} />
      <Stack
        sx={{
          width: '100vw',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h1" component="span">
          {errorEmoji[statusCode] || altEmoji}
        </Typography>
        <Typography variant="h3">{statusCode ? `Error ${statusCode}` : 'Aww! Shit'}</Typography>
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{ fontWeight: 'normal', mt: 1, textAlign: 'center' }}
        >
          {errorText[statusCode] || (
            <>
              We did not expect this to happen. We are so sorry. <br />
              Our developers have just been informed of this error and will fix it asap.
            </>
          )}
        </Typography>

        <Link href="/" passHref>
          <Button component="a" variant="contained" size="medium" sx={{ mt: 4 }}>
            Go Home
          </Button>
        </Link>
      </Stack>
    </>
  );
}
