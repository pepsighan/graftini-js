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
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDuplicatePage, useMyProject } from 'store/projects';
import { routeRegex } from 'utils/constants';
import { z } from 'zod';

export default function DuplicatePageDialog({ isOpen, onClose, pageId, projectId }) {
  const {
    project: { pages },
  } = useMyProject({ projectId });

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
          const exists = pages.some((page) => page.route === route);
          return !exists;
        },
        { message: 'The route already exists.' }
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({ resolver: zodResolver(schema) });

  const [duplicatePage] = useDuplicatePage({ projectId });

  const onSubmit = useCallback(
    async (state) => {
      await duplicatePage({
        variables: {
          input: {
            projectId,
            name: state.name,
            route: state.route,
            copyPageId: pageId,
          },
        },
      });
      onClose();
    },
    [duplicatePage, onClose, pageId, projectId]
  );

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Duplicate Page</DialogTitle>
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
            Duplicate
          </AsyncButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
