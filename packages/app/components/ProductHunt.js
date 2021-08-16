import { Button, Stack, TextField } from '@material-ui/core';

export default function ProductHunt() {
  return (
    <Stack
      component="form"
      direction="row"
      action="https://api.producthunt.com/widgets/upcoming/v1/upcoming/graftini/forms"
      method="post"
      id="ph-email-form"
      name="ph-email-form"
      target="_blank"
    >
      <TextField
        type="email"
        name="email"
        id="ph-email"
        placeholder="Email Address"
        required
        size="medium"
        sx={{
          minWidth: {
            sm: 250,
          },
        }}
      />
      <Button
        variant="contained"
        type="submit"
        size="medium"
        name="subscribe"
        id="ph-subscribe-button"
        sx={{
          ml: 1,
          px: 2,
        }}
      >
        Subscribe
      </Button>
    </Stack>
  );
}
