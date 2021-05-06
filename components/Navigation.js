import { Button, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { loginWithGitHub, logout, useAuthUser } from 'store/auth';

export default function Navigation() {
  const { push } = useRouter();

  const onLogin = useCallback(async () => {
    await loginWithGitHub();
    push('/dashboard/projects');
  }, [push]);

  const { user } = useAuthUser();

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
      <Link href="/" passHref>
        <Text as="a" fontWeight="bold">
          Nocodepress
        </Text>
      </Link>
      {!user && (
        <Button colorScheme="blue" onClick={onLogin}>
          Login
        </Button>
      )}
      {user && (
        <Flex>
          <Link href="/dashboard/projects">
            <Button colorScheme="blue">Dashboard</Button>
          </Link>

          <Button ml={2} onClick={logout}>
            Logout
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
