import { useEditor } from '@graftini/graft';
import produce from 'immer';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export default function CanvasForm({ elementId, onTransformValues, children }) {
  const { getState } = useEditor();
  const componentProps = useMemo(() => getState()[elementId].props, [elementId, getState]);

  const form = useForm({
    defaultValues: componentProps,
    mode: 'onChange',
    resolver: (values) => {
      let transformed = values;

      if (onTransformValues != null) {
        transformed = produce(values, onTransformValues);
      }

      // TODO: Set the props of the element. There are no API to do it right now
      // with graft.
      //
      // Sync any changes within the form to the component props.
      // setComponentProps((props) => {
      //   Object.keys(transformed).forEach((key) => {
      //     props[key] = transformed[key];

      //     // Sync the transformed values to the form fields itself.
      //     form.setValue(key, transformed[key]);
      //   });
      // });

      // We do not do show any errors here.
      return { values, errors: {} };
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}
