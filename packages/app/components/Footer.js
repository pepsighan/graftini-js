import { Stack, Typography } from '@material-ui/core';
import Link from './Link';

export default function Footer() {
  return (
    <Stack direction="row" spacing={2} justifyContent="center">
      <Typography color="textSecondary">&copy; {new Date().getFullYear()} Graftini.com</Typography>

      <Link href="/privacy">Privacy</Link>
      <Link href="/terms-of-service">Terms</Link>
      <Link href="/contact">Contact</Link>
    </Stack>
  );
}
