import { Box, Button, InputAdornment, Stack, TextField, Typography } from '@material-ui/core';
import { wideLabelAlignmentStyle } from 'canvasComponents/form/formLabels';
import Footer from 'components/Footer';
import Navigation from 'components/Navigation';
import SEO from 'components/SEO';
import { navBarHeight } from 'utils/constants';

export default function Contact() {
  return (
    <>
      <SEO />
      <Navigation />

      <Stack
        justifyContent="space-between"
        sx={{ height: `calc(100vh - ${navBarHeight}px)`, px: 2 }}
      >
        <Stack alignItems="center" sx={{ pt: 8 }}>
          <Typography variant="h3" textAlign="center">
            Contact
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            fontWeight="normal"
            color="textSecondary"
            sx={{ mt: 1 }}
          >
            Reach out to us in case you have questions or want to upgrade your existing plan.
          </Typography>

          <Stack spacing={2} sx={{ width: 400, mt: 4 }}>
            <TextField
              size="medium"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={wideLabelAlignmentStyle}>
                    <Typography variant="body1">Name</Typography>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              size="medium"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={wideLabelAlignmentStyle}>
                    <Typography variant="body1">Email</Typography>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              size="medium"
              fullWidth
              multiline
              minRows={5}
              maxRows={10}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{
                      alignSelf: 'flex-start',
                      marginTop: 1.4,
                      marginBottom: 1.8,
                    }}
                  >
                    <Typography variant="body1">Message</Typography>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  flexDirection: 'column',
                },
              }}
            />

            <Button variant="contained" size="medium">
              Send
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ width: '100%', pb: 1, pt: 6 }}>
          <Footer />
        </Box>
      </Stack>
    </>
  );
}
