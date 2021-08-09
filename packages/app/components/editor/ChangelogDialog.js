import { Box, Chip, Dialog, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import { Fragment } from 'react';

// Increment this once the changelog has been updated.
export const version = '1';

const changelog = [
  {
    date: '8-Aug-2021',
    features: [
      { text: 'You can now create new projects with templates 🎉.' },
      {
        text: 'Color picker now supports palettes that intelligently lists all the colors used on the page.',
      },
    ],
  },
];

export default function ChangelogDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Changelog</DialogTitle>
      <DialogContent>
        {changelog.map((it) => (
          <Fragment key={it.date}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 0.5 }}>
              {it.date}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip label="Features" color="info" size="small" />

              <Box component="ul" sx={{ pl: 3, mt: 0.5 }}>
                {it.features.map((feature, index) => (
                  <Typography key={index} component="li">
                    {feature.text}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Fragment>
        ))}
      </DialogContent>
    </Dialog>
  );
}
