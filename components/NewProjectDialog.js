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
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateProject } from 'store/projects';

export default function NewProjectDialog({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const { push } = useRouter();
  const [createProject] = useCreateProject();

  const onSubmit = useCallback(
    async (state) => {
      const { data, errors } = await createProject({
        variables: {
          input: {
            name: state.name,
          },
        },
      });

      if (errors?.length > 0) {
        return;
      }

      if (data?.createProject?.id) {
        await push(`/dashboard/project/${data.createProject.id}`);
      }
    },
    [createProject, push]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>New Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input {...register('name')} placeholder="Name of the project" />
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
