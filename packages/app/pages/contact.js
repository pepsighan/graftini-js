import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, InputAdornment, Stack, TextField, Typography, Link } from '@material-ui/core';
import { wideLabelAlignmentStyle } from 'canvasComponents/form/formLabels';
import AsyncButton from 'components/AsyncButton';
import Footer from 'components/Footer';
import Navigation from 'components/Navigation';
import SEO from 'components/SEO';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSendContactMessage } from 'store/contact';
import { navBarHeight } from 'utils/constants';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  content: z.string().min(1),
});

export default function Contact() {
  const [isSent, setIsSent] = useState(false);
  const [isNotSent, setIsNotSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      content: '',
    },
    resolver: zodResolver(schema),
  });

  const { ref: nameRef, ...nameRegister } = register('name');
  const { ref: emailRef, ...emailRegister } = register('email');
  const { ref: contentRef, ...contentRegister } = register('content');

  const [sendContactMessage] = useSendContactMessage();
  const onSubmit = useCallback(
    async (state) => {
      setIsSent(false);
      setIsNotSent(false);
      try {
        await sendContactMessage({
          variables: {
            input: state,
          },
        });
        reset();
        setIsSent(true);
      } catch (err) {
        setIsNotSent(true);
        throw err;
      }
    },
    [reset, sendContactMessage]
  );

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

          <Stack
            component="form"
            spacing={2}
            sx={{
              width: {
                xs: '100%',
                sm: 400,
              },
              mt: 4,
            }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextField
              {...nameRegister}
              inputRef={nameRef}
              size="medium"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={wideLabelAlignmentStyle}>
                    <Typography variant="body1">Name</Typography>
                  </InputAdornment>
                ),
              }}
              error={!!errors?.name}
              helperText={errors?.name?.message}
            />

            <TextField
              {...emailRegister}
              inputRef={emailRef}
              size="medium"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={wideLabelAlignmentStyle}>
                    <Typography variant="body1">Email</Typography>
                  </InputAdornment>
                ),
              }}
              error={!!errors?.email}
              helperText={errors?.email?.message}
            />

            <TextField
              {...contentRegister}
              inputRef={contentRef}
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
              error={!!errors?.content}
              helperText={errors?.content?.message}
            />

            <AsyncButton type="submit" variant="contained" size="medium" isLoading={isSubmitting}>
              Send
            </AsyncButton>

            {isSent && (
              <Alert>
                Thank you for reaching out to us. We will get back to you as soon as possible.
              </Alert>
            )}

            {isNotSent && (
              <Alert severity="error">
                Sorry, we could not sent your message at this moment. Can you try again later?
              </Alert>
            )}

            <Typography textAlign="center" fontWeight="normal" sx={{ mt: 1 }}>
              You may reach us via <Link href="mailto:team@graftini.com">team@graftini.com</Link> as
              well.
            </Typography>
          </Stack>
        </Stack>

        <Box sx={{ width: '100%', pb: 1, pt: 6 }}>
          <Footer />
        </Box>
      </Stack>
    </>
  );
}
