import { Button, CircularProgress } from '@material-ui/core';

export default function AsyncButton({ isLoading, children, disabled, ...rest }) {
  return (
    <Button {...rest} disabled={isLoading || disabled}>
      {isLoading ? <CircularProgress size={20} /> : children}
    </Button>
  );
}
