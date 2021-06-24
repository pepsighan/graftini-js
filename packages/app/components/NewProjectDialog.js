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
import { defaultComponentMap } from '@graftini/graft';
import Root from 'canvasComponents/Root';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateProject } from 'store/projects';
import { slugify } from 'utils/url';

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
            defaultPageComponentMap: JSON.stringify(
              defaultComponentMap(Root.graftOptions.defaultProps)
            ),
          },
        },
      });

      if (errors?.length > 0) {
        return;
      }

      if (data?.createProject?.id) {
        await push(
          `/dashboard/project/${slugify({
            id: data.createProject.id,
            name: data.createProject.name,
          })}`
        );
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
            <Input {...register('name')} placeholder="Name of the project" autoComplete="off" />
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
