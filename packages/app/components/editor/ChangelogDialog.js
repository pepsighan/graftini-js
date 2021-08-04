import { Box, Chip, Dialog, DialogContent, DialogTitle, Typography } from '@material-ui/core';

// Increment this once the changelog has been updated.
export const version = '1';

const changelog = [
  {
    // TODO: Decide the release date of the app.
    date: 'TBD-Aug-2021',
    features: [{ text: 'You can now create new projects with templates 🎉.' }],
  },
];

export default function ChangelogDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Changelog</DialogTitle>
      <DialogContent>
        {changelog.map((it) => (
          <>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 0.5 }}>
              {it.date}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip label="Features" color="info" size="small" />

              <Box component="ul" sx={{ pl: 3, mt: 0.5 }}>
                {it.features.map((feature) => (
                  <Typography component="li">{feature.text}</Typography>
                ))}
              </Box>
            </Box>
          </>
        ))}
      </DialogContent>
    </Dialog>
  );
}
