import { defaultComponentMap } from '@graftini/graft';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
} from '@material-ui/core';
import Root from 'canvasComponents/Root';
import { materialRegister } from 'hooks/useMaterialFormRegister';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateProject } from 'store/projects';
import { slugify } from 'utils/url';
import AsyncButton from './AsyncButton';

export default function NewProjectDialog({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const { push } = useRouter();
  const [createProject] = useCreateProject();

  const onSubmit = useCallback(
    async (state) => {
      const { data, errors } = await createProject({
        variables: {
          input: {
            name: state.name,
            defaultPageComponentMap: JSON.stringify(
              defaultComponentMap(Root.graftOptions.defaultProps)
            ),
          },
        },
      });

      if (errors?.length > 0) {
        return;
      }

      if (data?.createProject?.id) {
        await push(
          `/dashboard/project/${slugify({
            id: data.createProject.id,
            name: data.createProject.name,
          })}`
        );
      }
    },
    [createProject, push]
  );

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>New Project</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            {...materialRegister(register, 'name')}
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="body2">Name</Typography>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>

        <DialogActions>
          <AsyncButton type="submit" variant="contained" size="small" isLoading={isSubmitting}>
            Create
          </AsyncButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
