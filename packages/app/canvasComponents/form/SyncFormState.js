import { useEditor } from '@graftini/graft';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export default function SyncFormState({ componentId, onSync }) {
  const { watch } = useFormContext();
  const { updateComponentProps } = useEditor();

  // Sync the form state to the component props.
  useEffect(() => {
    const subscription = watch((formState) => {
      console.log(formState);

      updateComponentProps(componentId, (props) => {
        onSync(props, formState);
      });
    });

    return () => subscription.unsubscribe();
  }, [componentId, onSync, updateComponentProps, watch]);

  return <></>;
}
