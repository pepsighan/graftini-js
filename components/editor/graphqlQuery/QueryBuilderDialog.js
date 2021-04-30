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
import { nanoid } from 'nanoid';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useEditorState } from 'store/editor';
import { useImmerSetter } from 'store/zustand';
import QueryBuilder from './QueryBuilder';

export default function QueryBuilderDialog({ isOpen, onClose }) {
  const form = useForm();
  const updateEditorState = useImmerSetter(useEditorState);

  const onSubmit = useCallback(
    (values) => {
      updateEditorState((state) => {
        state.savedQueries.push({
          id: nanoid(),
          variableName: values.variableName,
          query: values.query,
        });
      });
      onClose();
    },
    [onClose, updateEditorState]
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
            <Button onClick={form.handleSubmit(onSubmit)}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormProvider>
  );
}
