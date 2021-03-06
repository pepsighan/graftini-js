import { Badge, IconButton, Tooltip } from '@material-ui/core';
import { ArchiveIcon } from '@modulz/radix-icons';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';
import { useBeforeUnload } from 'react-use';

export default function SavingStatus() {
  const isSaving = useDesignerState(useCallback((state) => state.isSaving, []));

  // Stop the tab from being closed when the project is actively being saved.
  // This text is not shown on the latest browsers. The browser shows a default
  // prompt which works for us.
  useBeforeUnload(isSaving, 'The changes are being saved. Are you sure you want to exit?');

  return (
    <Tooltip title={isSaving ? 'Saving your project right now.' : 'Your project is saved.'}>
      <IconButton color="default">
        <Badge variant="dot" color="info" invisible={!isSaving}>
          <ArchiveIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}
