import { Text } from '@chakra-ui/react';
import { print } from 'graphql';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { generateGraphQLAST } from 'utils/graphqlAst';

export default function QueryText() {
  const { watch } = useFormContext();
  const [queryTxt, setQueryTxt] = useState('');

  useEffect(() => {
    const sub = watch((state) => {
      const ast = generateGraphQLAST(state.variableName ?? '', state.query ?? {});
      setQueryTxt(print(ast).trim());
    });

    return () => sub.unsubscribe();
  }, [watch]);

  return queryTxt ? (
    <Text as="pre" backgroundColor="gray.100" p={2} fontSize="sm">
      {queryTxt}
    </Text>
  ) : null;
}
