import { useEditor } from '@graftini/graft';
import { useEffect } from 'react';
import { FunctionComponent, ReactNode, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

type CanvasFormProps<T, S> = {
  componentId: string;
  /**
   * Transform the initial state to the one consumable by the form.
   */
  onInitialize?(initialState: T): S;
  /**
   * Sync the form state to the component props.
   */
  onSync(props: T, formState: S): void;
  children?: ReactNode;
};

export type CanvasFormComponent<T, S> = FunctionComponent<CanvasFormProps<T, S>>;

const CanvasForm: FunctionComponent = <T, S>({
  componentId,
  onInitialize,
  onSync,
  children,
}: CanvasFormProps<T, S>) => {
  const { getState } = useEditor();

  const form = useForm({
    // Get the default values for the form and initialize it once.
    defaultValues: useMemo(
      () =>
        onInitialize
          ? (onInitialize(getState()[componentId].props as T) as any)
          : getState()[componentId].props,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    ),
    mode: 'onChange',
  });

  useSyncFormState({ watch: form.watch, componentId, onSync });
  return <FormProvider {...form}>{children}</FormProvider>;
};

function useSyncFormState({ watch, componentId, onSync }) {
  const { updateComponentProps } = useEditor();

  // Sync the form state to the component props.
  useEffect(() => {
    const subscription = watch((formState: any) => {
      updateComponentProps(componentId, (props) => {
        onSync(props, formState);
      });
    });

    return () => subscription.unsubscribe();
  }, [componentId, onSync, updateComponentProps, watch]);
}

export default CanvasForm;
