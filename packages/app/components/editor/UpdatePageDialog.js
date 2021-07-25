import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@material-ui/core';
import useEnableContextMenu from 'canvasComponents/form/useEnableContextMenu';
import AsyncButton from 'components/AsyncButton';
import { materialRegister } from 'hooks/useMaterialFormRegister';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useMyProject, useUpdatePage } from 'store/projects';
import { routeRegex } from 'utils/constants';
import { z } from 'zod';

export default function UpdatePageDialog({ isOpen, onClose, projectId, pageId }) {
  const { project } = useMyProject({ projectId });
  const page = useMemo(
    () => project.pages.find((page) => page.id === pageId),
    [pageId, project.pages]
  );

  const schema = z.object({
    name: z.string().min(1, { message: 'Page name is required.' }),
    route: z
      .string()
      .regex(routeRegex, { message: 'Provide a valid route.' })
      .transform((route) => {
        // This is the only exception to the following trimming.
        if (route === '/') {
          return route;
        }

        // Cannot have trailing slashes.
        if (route.endsWith('/')) {
          return route.replace(/\/$/, '');
        }
        return route;
      })
      .refine(
        (route) => {
          const exists = project.pages.find((page) => page.route === route);
          // If it matches to self then no problem.
          if (exists?.id === pageId) {
            return true;
          }

          return !exists;
        },
        { message: 'The route already exists.' }
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      name: page.name,
      route: page.route,
    },
    resolver: zodResolver(schema),
  });

  const [updatePage] = useUpdatePage({ projectId });

  const onSubmit = useCallback(
    async (state) => {
      await updatePage({
        variables: {
          input: {
            projectId,
            pageId,
            name: state.name,
            route: state.route,
          },
        },
      });
      onClose();
    },
    [updatePage, projectId, pageId, onClose]
  );

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Update Page</DialogTitle>
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
              inputProps={{
                onContextMenu: useEnableContextMenu(),
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
              inputProps={{
                onContextMenu: useEnableContextMenu(),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <AsyncButton type="submit" variant="contained" isLoading={isSubmitting}>
            Save
          </AsyncButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
