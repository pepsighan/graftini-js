import { IconButton } from '@chakra-ui/button';
import { mdiArrowLeft } from '@mdi/js';
import Link from 'next/link';
import Icon from './Icon';

export default function BackButton({ href }) {
  return (
    <Link href={href}>
      <IconButton size="sm" variant="ghost" icon={<Icon icon={mdiArrowLeft} fontSize="xl" />} />
    </Link>
  );
}
