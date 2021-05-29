import { Button, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { loginWithGitHub, logout, useAuthUser } from 'store/auth';

export default function Navigation({ isTransparent }) {
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
      backgroundColor={isTransparent ? 'transparent' : 'gray.50'}
    >
      <Link href="/" passHref>
        <Text as="a" fontSize="xl" fontWeight={500} color={isTransparent ? 'white' : 'black'}>
          Graftini
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
