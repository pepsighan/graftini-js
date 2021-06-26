import { useFormContext } from 'react-hook-form';
import { useEditor } from '@graftini/graft';
import { useCallback } from 'react';

export default function SyncFormState({ componentId, onSync }) {
  const { watch } = useFormContext();
  const { updateComponentProps } = useEditor();

  // Sync the form state to the component props.
  watch(
    useCallback(
      (state) => {
        updateComponentProps(componentId, (props) => ({
          ...props,
          ...onSync(state),
        }));
      },
      [componentId, onSync, updateComponentProps]
    )
  );

  return <></>;
}
