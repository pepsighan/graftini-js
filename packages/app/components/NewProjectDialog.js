import { defaultComponentMap } from '@graftini/graft';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@material-ui/core';
import Root from 'canvasComponents/Root';
import { materialRegister } from 'hooks/useMaterialFormRegister';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateProject, useMyProjects } from 'store/projects';
import config, { Environment } from 'utils/config';
import { slugify } from 'utils/url';
import { z } from 'zod';
import AsyncButton from './AsyncButton';
import ProjectTemplates from './ProjectTemplates';

const schema = z.object({
  name: z.string().min(1),
  templateId: z.string().min(1, { message: 'Select a template to begin.' }),
});

export default function NewProjectDialog({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>New Project</DialogTitle>
      <Form key={isOpen} />
    </Dialog>
  );
}

function Form() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
  } = useForm({
    defaultValues: {
      name: '',
      templateId: '',
    },
    resolver: zodResolver(schema),
  });
  const { push } = useRouter();
  const [createProject] = useCreateProject();

  const { myProjects } = useMyProjects();
  // Limit the no of projects to 2 in production.
  const isProjectLimitReached = config.ENV === Environment.Production && myProjects.length >= 2;

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        {isProjectLimitReached && (
          <Alert severity="info">
            You have reached your projects limit.
            <Typography variant="inherit">
              Contact us at <Link href="mailto:sales@graftini.com">sales@graftini.com</Link> to
              request an increase.
            </Typography>
          </Alert>
        )}

        {!isProjectLimitReached && (
          <>
            <ProjectTemplates control={control} error={errors.templateId?.message} />

            <TextField
              {...materialRegister(register, 'name')}
              autoComplete="off"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography variant="body2">Name</Typography>
                  </InputAdornment>
                ),
              }}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{ mt: 2 }}
            />
          </>
        )}
      </DialogContent>

      <DialogActions>
        <AsyncButton
          type="submit"
          variant="contained"
          size="small"
          disabled={isProjectLimitReached}
          isLoading={isSubmitting}
        >
          Create
        </AsyncButton>
      </DialogActions>
    </form>
  );
}
