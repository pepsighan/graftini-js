import { Icon as CIcon } from '@chakra-ui/react';
import { Icon as MIcon } from '@mdi/react';

function MdiIcon({ path, className }) {
  return <MIcon path={path} className={className} />;
}

export default function Icon({ icon, ...rest }) {
  return <CIcon as={MdiIcon} path={icon} {...rest} />;
}
