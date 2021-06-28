import { useEditorStore, useEditorStoreApi } from '@graftini/graft';
import { FunctionComponent, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { FormProvider, Resolver, useForm } from 'react-hook-form';

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
  resolver?: Resolver;
  children?: ReactNode;
};

export type CanvasFormComponent<T, S> = FunctionComponent<CanvasFormProps<T, S>>;

const CanvasForm: FunctionComponent = <T, S>({
  componentId,
  onInitialize,
  onSync,
  resolver,
  children,
}: CanvasFormProps<T, S>) => {
  const { getState } = useEditorStoreApi();

  const form = useForm({
    // Get the default values for the form and initialize it once.
    defaultValues: useMemo(
      () =>
        onInitialize
          ? (onInitialize(getState().componentMap[componentId].props as T) as any)
          : getState().componentMap[componentId].props,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    ),
    mode: 'onChange',
    resolver,
  });

  useSyncFormState({ watch: form.watch, componentId, onSync });
  return <FormProvider {...form}>{children}</FormProvider>;
};

function useSyncFormState({ watch, componentId, onSync }) {
  const immerSetEditor = useEditorStore(useCallback((state) => state.immerSet, []));

  // Sync the form state to the component props.
  useEffect(() => {
    const subscription = watch((formState: any) => {
      immerSetEditor((state) => {
        onSync(state.componentMap[componentId].props, formState);
      });
    });

    return () => subscription.unsubscribe();
  }, [componentId, immerSetEditor, onSync, watch]);
}

export default CanvasForm;
