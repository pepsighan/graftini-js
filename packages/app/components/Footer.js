import { Stack, Typography, useTheme } from '@material-ui/core';
import Link from './Link';

export default function Footer() {
  const { typography } = useTheme();

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="center"
      sx={{ fontSize: typography.body2.fontSize }}
    >
      <Typography variant="body2" color="textSecondary">
        &copy; {new Date().getFullYear()} Graftini.com
      </Typography>

      <Link href="/privacy">Privacy</Link>
      <Link href="/terms-of-service">Terms</Link>
      <Link href="/contact">Contact</Link>
    </Stack>
  );
}
