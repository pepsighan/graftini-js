import { IconButton } from '@material-ui/core';
import { ArrowLeftIcon } from '@modulz/radix-icons';
import Link from 'next/link';

export default function BackButton({ href }) {
  return (
    <Link href={href}>
      <IconButton>
        <ArrowLeftIcon />
      </IconButton>
    </Link>
  );
}
