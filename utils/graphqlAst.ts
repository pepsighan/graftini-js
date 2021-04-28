import { ASTNode, SelectionNode } from 'graphql';
import { set } from 'lodash-es';

/**
 * Each key represents a field in the tree of GraphQL schema that has been selected to be
 * fetched by the user.
 *
 * THe input is in a raw format where the keys are in the format `parent-nest1-nest2-nest3` and so on.
 * `parent` is the top most container of the tree. `nest1` is its child, nest2 is the child of nest1
 * and so on.
 */
type QueryInput = {
  [key: string]: boolean;
};

/**
 * Generate a GraphQL AST using the input which defines which fields to fetch. Since the [input]
 * is raw, only those fields will be generated in the AST which have unbroken link from the root
 * of the GraphQL tree to the fields themselves.
 */
export function generateGraphQLAST(queryName: string, input: QueryInput): ASTNode {
  const selectedFieldKeys = Object.keys(input).filter((it) => input[it]);

  // These are the fields that have a path from the root to the said node.
  // For ex: abc, abc-def, abc-def-ghi exists then all three are selected.
  // If abc, abc-def-ghi exists, then only abc is selected and the other one
  // is removed because def link does not exist.
  const fieldsWithPath = selectedFieldKeys.filter((it) => {
    const splits: string[] = it.split('-');

    let key: string;
    const linkExists = splits.every((split) => {
      key = key ? `${key}-${split}` : split;
      return selectedFieldKeys.includes(key);
    });

    return linkExists;
  });

  // Only select the leaf fields from the valid ones.
  const leafFieldsOnly = fieldsWithPath.filter(
    (it) => !fieldsWithPath.some((field) => field.includes(`${it}-`))
  );

  const queryObject = {};
  leafFieldsOnly.forEach((it) => {
    set(queryObject, it.split('-').join('.'), true);
  });

  const selections = generateSelectionNodes(queryObject);

  return {
    kind: 'Document',
    definitions: [
      {
        kind: 'OperationDefinition',
        operation: 'query',
        name: {
          kind: 'Name',
          value: queryName,
        },
        selectionSet: {
          kind: 'SelectionSet',
          selections: selections,
        },
      },
    ],
  };
}

function generateSelectionNodes(query: any): SelectionNode[] {
  if (!query) {
    return [];
  }

  return Object.keys(query).map((key) => ({
    kind: 'Field',
    name: {
      kind: 'Name',
      value: key,
    },
    selectionSet: {
      kind: 'SelectionSet',
      selections: generateSelectionNodes(query[key]),
    },
  }));
}
