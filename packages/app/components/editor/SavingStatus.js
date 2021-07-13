import { IconButton, Tooltip } from '@material-ui/core';
import { ArchiveIcon } from '@modulz/radix-icons';
import { useCallback } from 'react';
import { useDesignerState } from 'store/designer';

export default function SavingStatus() {
  const isSaving = useDesignerState(useCallback((state) => state.isSaving, []));

  return (
    <Tooltip title={isSaving ? 'Saving your project right now.' : 'Your project is saved.'}>
      <IconButton color={isSaving ? 'primary' : 'default'}>
        <ArchiveIcon />
      </IconButton>
    </Tooltip>
  );
}
