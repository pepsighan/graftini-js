import { useEditor } from '@graftini/graft';
import produce from 'immer';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export default function CanvasForm({ componentId, onTransformValues, children }) {
  const { getState, updateComponentProps } = useEditor();
  const componentProps = useMemo(() => getState()[componentId].props, [componentId, getState]);

  const form = useForm({
    defaultValues: componentProps,
    mode: 'onChange',
    resolver: (values) => {
      let transformed = values;

      if (onTransformValues != null) {
        transformed = produce(values, onTransformValues);
      }

      updateComponentProps(componentId, (props) => ({ ...props, ...transformed }));

      // We do not do show any errors here.
      return { values, errors: {} };
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}
