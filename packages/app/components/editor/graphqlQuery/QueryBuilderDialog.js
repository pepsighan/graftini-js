import { Button } from '@chakra-ui/button';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import useMyProjectFromRouter from 'hooks/useMyProjectFromRouter';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useCreateQuery } from 'store/projects';
import { generateGraphQLAST } from 'utils/graphqlAst';
import QueryBuilder from './QueryBuilder';

export default function QueryBuilderDialog({ isOpen, onClose }) {
  const form = useForm();

  const {
    project: { id: projectId },
  } = useMyProjectFromRouter();
  const [createQuery] = useCreateQuery({ projectId });

  const onSubmit = useCallback(
    async (values) => {
      await createQuery({
        variables: {
          input: {
            projectId,
            variableName: values.variableName,
            gqlAst: JSON.stringify(generateGraphQLAST(values.variableName, values.query)),
          },
        },
      });

      onClose();
    },
    [createQuery, onClose, projectId]
  );

  return (
    <FormProvider {...form}>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Query Builder</ModalHeader>
          <ModalCloseButton />
          <ModalBody sx={{ maxHeight: 500, overflowY: 'auto' }}>
            <QueryBuilder />
          </ModalBody>
          <ModalFooter>
            <Button isLoading={form.formState.isSubmitting} onClick={form.handleSubmit(onSubmit)}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormProvider>
  );
}
