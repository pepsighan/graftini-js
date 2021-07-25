import { gql, useMutation } from '@apollo/client';

/**
 * Send the contact message from the contact form.
 */
export function useSendContactMessage() {
  return useMutation(gql`
    mutation SendContactMessage($input: ContactUsMessage!) {
      contactUs(input: $input)
    }
  `);
}
