import { useEditor } from '@graftini/graft';
import produce from 'immer';
import { FunctionComponent, ReactNode, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

type CanvasFormProps<T, S> = {
  componentId: string;
  fieldNames: string[];
  /**
   * Transform the initial state to the one consumable by the form.
   */
  onInitialize: (initialState: T) => S;
  /**
   * Transform the form state to the one acceptable to the component props and update it.
   */
  onTransformValues: (values: S) => void;
  children?: ReactNode;
};

export type CanvasFormComponent<T, S> = FunctionComponent<CanvasFormProps<T, S>>;

const CanvasForm: FunctionComponent = <T, S>({
  componentId,
  fieldNames,
  onInitialize,
  onTransformValues,
  children,
}: CanvasFormProps<T, S>) => {
  const { getState, updateComponentProps } = useEditor();
  const componentProps = useMemo(() => getState()[componentId].props, [componentId, getState]) as T;

  const form = useForm({
    // Get the default values for the form and initialize it once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    defaultValues: useMemo(() => onInitialize(componentProps) as any, []),
    mode: 'onChange',
    resolver: (values) => {
      let transformed = produce(values, onTransformValues);

      // Only pass those fields that are in the field names to the component props.
      const filtered = fieldNames.reduce((acc, cur) => {
        acc[cur] = transformed[cur];
        return acc;
      }, {});

      updateComponentProps(componentId, (props) => ({ ...props, ...filtered }));

      // We do not do show any errors here.
      return { values, errors: {} };
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
};

export default CanvasForm;
