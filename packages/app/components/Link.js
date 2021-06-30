import { Link as MLink } from '@material-ui/core';
import NLink from 'next/link';

export default function Link({ href, ...rest }) {
  return (
    <NLink href={href} passHref>
      <MLink {...rest} />
    </NLink>
  );
}
