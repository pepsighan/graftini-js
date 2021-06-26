import { useEditor } from '@graftini/graft';
import { FunctionComponent, ReactNode, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

type CanvasFormProps<T, S> = {
  componentId: string;
  /**
   * Transform the initial state to the one consumable by the form.
   */
  onInitialize: (initialState: T) => S;
  children?: ReactNode;
};

export type CanvasFormComponent<T, S> = FunctionComponent<CanvasFormProps<T, S>>;

const CanvasForm: FunctionComponent = <T, S>({
  componentId,
  onInitialize,
  children,
}: CanvasFormProps<T, S>) => {
  const { getState } = useEditor();
  const componentProps = useMemo(() => getState()[componentId].props, [componentId, getState]) as T;

  const form = useForm({
    // Get the default values for the form and initialize it once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    defaultValues: useMemo(() => onInitialize(componentProps) as any, []),
    mode: 'onChange',
  });

  return <FormProvider {...form}>{children}</FormProvider>;
};

export default CanvasForm;
