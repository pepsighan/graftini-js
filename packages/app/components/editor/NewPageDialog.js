import { defaultComponentMap } from '@graftini/graft';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  InputAdornment,
  Typography,
} from '@material-ui/core';
import Root from 'canvasComponents/Root';
import { materialRegister } from 'hooks/useMaterialFormRegister';
import useMyProjectFromRouter from 'hooks/useMyProjectFromRouter';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useCreatePage } from 'store/projects';
import { routeRegex } from 'utils/constants';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, { message: 'Page name is required.' }),
  route: z.string().regex(routeRegex, { message: 'Provide a valid route.' }),
});

export default function NewPageDialog({ isOpen, onClose }) {
  const {
    project: { id: projectId },
  } = useMyProjectFromRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({ resolver: zodResolver(schema) });

  const [createPage] = useCreatePage({ projectId });

  const onSubmit = useCallback(
    async (state) => {
      await createPage({
        variables: {
          input: {
            projectId,
            name: state.name,
            route: state.route,
            componentMap: JSON.stringify(defaultComponentMap(Root.graftOptions.defaultProps)),
          },
        },
      });
      onClose();
    },
    [createPage, onClose, projectId]
  );

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>New Page</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              {...materialRegister(register, 'name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography variant="body2">Name</Typography>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              {...materialRegister(register, 'route')}
              error={!!errors.route}
              helperText={errors.route?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography variant="body2">Route</Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
