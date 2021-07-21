import { IconButton, Tooltip } from '@material-ui/core';
import { ArchiveIcon } from '@modulz/radix-icons';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import { useBeforeunload } from 'react-beforeunload';

export default function SavingStatus() {
  const isSaving = useDesignerState(useCallback((state) => state.isSaving, []));

  // Stop the tab from being closed when the project is actively being saved.
  useBeforeunload(() => {
    if (isSaving) {
      // This text is not shown on the latest browsers. The browser shows a default
      // prompt which works for us.
      return 'The changes are being saved. Are you sure you want to exit? ';
    }
  });

  return (
    <Tooltip title={isSaving ? 'Saving your project right now.' : 'Your project is saved.'}>
      <IconButton color={isSaving ? 'primary' : 'default'}>
        <ArchiveIcon />
      </IconButton>
    </Tooltip>
  );
}
