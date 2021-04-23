import { useEditor } from '@craftjs/core';
import produce from 'immer';
import { useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

/**
 * Gets props of the user component denoted by the given componentId.
 */
function useComponentProps({ componentId }) {
  const { actions, query } = useEditor();

  const props = useMemo(() => (componentId ? query.node(componentId).get().data.props : null), [
    query,
    componentId,
  ]);

  const setProps = useCallback(
    (cb) => {
      if (!componentId) {
        return;
      }
      actions.setProp(componentId, cb);
    },
    [actions, componentId]
  );

  return [props, setProps];
}

export default function CanvasForm({ componentId, onTransformValues, children }) {
  const [componentProps, setComponentProps] = useComponentProps({ componentId });

  const form = useForm({
    defaultValues: componentProps,
    mode: 'onChange',
    resolver: (values) => {
      let transformed = values;

      if (onTransformValues != null) {
        transformed = produce(values, onTransformValues);
      }

      // Sync any changes within the form to the component props.
      setComponentProps((props) => {
        Object.keys(transformed).forEach((key) => {
          props[key] = transformed[key];

          // Sync the transformed values to the form fields itself.
          form.setValue(key, transformed[key]);
        });
      });

      // We do not do show any errors here.
      return { values, errors: {} };
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}
