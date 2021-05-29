import { IconButton } from '@chakra-ui/button';
import Icon from '@chakra-ui/icon';
import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';

export default function BackButton({ href }) {
  return (
    <Link href={href}>
      <IconButton size="sm" variant="ghost" icon={<Icon as={MdArrowBack} fontSize="xl" />} />
    </Link>
  );
}
