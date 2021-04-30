import { Box } from '@chakra-ui/react';
import {
  GraphQLField,
  GraphQLFieldMap,
  GraphQLList,
  GraphQLObjectType,
  GraphQLOutputType,
} from 'graphql';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import CheckboxField from './CheckboxField';

type QueryTreeProps = {
  name: string;
  fields: GraphQLFieldMap<any, any>;
};

export default function QueryTree({ name, fields }: QueryTreeProps) {
  const keys = useMemo(
    () =>
      Object.keys(fields)
        .map((key) => ({ key, name: fields[key].name }))
        .sort((left, right) => {
          if (left.name < right.name) {
            return -1;
          }

          if (left.name > right.name) {
            return 1;
          }

          return 0;
        }),
    [fields]
  );

  return (
    <>
      {keys.map(({ key }) => (
        <QueryField key={key} name={name} field={fields[key]} />
      ))}
    </>
  );
}

/**
 * Get the sub fields of any given type.
 */
function subFieldsOfType(type: GraphQLOutputType): GraphQLFieldMap<any, any> {
  if (type instanceof GraphQLObjectType) {
    return type.getFields();
  }

  if (type instanceof GraphQLList) {
    return subFieldsOfType(type.ofType);
  }

  return {};
}

type QueryFieldProps = {
  name: string;
  field: GraphQLField<any, any>;
};

function QueryField({ name, field }: QueryFieldProps) {
  const { watch, getValues } = useFormContext();

  // Each field in the form is denoted by the series of names in the tree separated
  // by a dash. Using dot (.) as normally opined by react-hook-form causes data
  // structure complexities. Using dash (-) is plain and simple and does not conflict
  // with GraphQL as dashes are not present in names.
  const formFieldName = name ? `${name}-${field.name}` : field.name;
  // The form field name within the query object of the hook form state.
  const fullFormFieldName = `query.${formFieldName}`;

  const [isChecked, setIsChecked] = useState(() => getValues(formFieldName) ?? false);
  useEffect(() => {
    // Using watch and setting the state this way decreases useless re-render
    // of the whole tree.
    const sub = watch((state) => {
      setIsChecked(state.query?.[formFieldName]);
    });

    return () => {
      sub.unsubscribe();
    };
  }, [formFieldName, watch]);

  const subFields = useMemo(() => subFieldsOfType(field.type), [field.type]);

  return (
    <>
      <CheckboxField name={fullFormFieldName} label={field.name} />
      {isChecked && (
        <Box ml={2}>
          <QueryTree name={formFieldName} fields={subFields} />
        </Box>
      )}
    </>
  );
}
