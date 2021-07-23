import { Stack, Typography } from '@material-ui/core';
import Link from './Link';

// TODO: Position the footer at the bottom of the page.
export default function Footer() {
  return (
    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 16, py: 1 }}>
      <Typography color="textSecondary">&copy; {new Date().getFullYear()} Graftini.com</Typography>

      <Link href="/privacy">Privacy</Link>
      <Link href="/terms-of-service">Terms</Link>
      <Link href="/contact">Contact</Link>
    </Stack>
  );
}
