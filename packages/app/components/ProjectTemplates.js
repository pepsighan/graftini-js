import { Box, Button, Grid, Paper, Typography } from '@material-ui/core';
import { FileIcon } from '@modulz/radix-icons';
import { useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { useProjectTemplates } from 'store/templates';

export default function ProjectTemplates({ control, error }) {
  const { templates } = useProjectTemplates();

  return (
    <Box>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        Kick start your project with a template that suits your needs. If you want a clean slate,
        start from scratch.
      </Typography>

      <Controller
        name="templateId"
        control={control}
        render={({ field }) => (
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <BlankProject isSelected={field.value === 'blank'} onChange={field.onChange} />
            </Grid>
            {templates.map((template) => (
              <Grid key={template.id} item xs={4}>
                <Project
                  templateId={template.id}
                  isSelected={field.value === template.id}
                  onChange={field.onChange}
                  template={template}
                />
              </Grid>
            ))}
          </Grid>
        )}
      />
      {error && (
        <Typography variant="caption" color="error" sx={{ mx: 1.75 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

function BlankProject({ isSelected, onChange }) {
  return (
    <Button
      sx={{ flexDirection: 'column', width: '100%', p: 0 }}
      variant={isSelected ? 'contained' : null}
      onClick={useCallback(() => {
        onChange('blank');
      }, [onChange])}
    >
      <Paper
        sx={{
          height: 200,
          bgcolor: 'grey.100',
          color: 'grey.400',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <FileIcon width={64} height={64} />
      </Paper>
      <Typography variant="subtitle2" sx={{ px: 1, py: 0.5 }}>
        Blank
      </Typography>
    </Button>
  );
}

function Project({ templateId, isSelected, onChange, template }) {
  return (
    <Button
      sx={{ flexDirection: 'column', width: '100%', p: 0 }}
      variant={isSelected ? 'contained' : null}
      onClick={useCallback(() => {
        onChange(templateId);
      }, [onChange, templateId])}
    >
      <Paper
        sx={{
          height: 200,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          backgroundImage: template.fileUrl ? `url('${template.fileUrl}')` : undefined,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Typography variant="subtitle2" sx={{ px: 1, py: 0.5 }}>
        {template.name}
      </Typography>
    </Button>
  );
}
