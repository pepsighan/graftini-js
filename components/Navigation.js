import { Button, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useIsLoggedIn, loginWithGitHub } from 'store/auth';

export default function Navigation() {
  const { push } = useRouter();

  const isLoggedIn = useIsLoggedIn();
  const onLogin = useCallback(() => {
    if (isLoggedIn) {
      push('/dashboard');
      return;
    }

    loginWithGitHub();
    push('/dashboard');
  }, [isLoggedIn, push]);

  return (
    <Flex
      py={2}
      px={4}
      justifyContent="space-between"
      alignItems="center"
      position="sticky"
      top={0}
      backgroundColor="gray.50"
    >
      <Text fontWeight="bold">Nocodepress</Text>
      <Button colorScheme="blue" onClick={onLogin}>
        Login
      </Button>
    </Flex>
  );
}
