import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useCreatePage } from 'store/projects';
import { useProjectId } from './editor/Editor';

export default function NewPageDialog({ isOpen, onClose }) {
  const projectId = useProjectId();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const [createPage] = useCreatePage({ projectId });

  const onSubmit = useCallback(
    async (state) => {
      await createPage({
        variables: {
          input: {
            projectId,
            name: state.name,
            route: state.route,
          },
        },
      });
      onClose();
    },
    [createPage, onClose, projectId]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>New Page</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Input {...register('name')} placeholder="Name" />
              <Input {...register('route')} placeholder="Route" />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" isLoading={isSubmitting}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
