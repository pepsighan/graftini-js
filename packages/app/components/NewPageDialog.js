import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import { defaultComponentMap } from '@graftini/graft';
import { zodResolver } from '@hookform/resolvers/zod';
import Root from 'canvasComponents/Root';
import useMyProjectFromRouter from 'hooks/useMyProjectFromRouter';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useCreatePage } from 'store/projects';
import { routeRegex } from 'utils/constants';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, { message: 'Page name is required.' }),
  route: z.string().regex(routeRegex, { message: 'Provide a valid route.' }),
});

export default function NewPageDialog({ isOpen, onClose }) {
  const {
    project: { id: projectId },
  } = useMyProjectFromRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({ resolver: zodResolver(schema) });

  const [createPage] = useCreatePage({ projectId });

  const onSubmit = useCallback(
    async (state) => {
      await createPage({
        variables: {
          input: {
            projectId,
            name: state.name,
            route: state.route,
            componentMap: JSON.stringify(defaultComponentMap(Root.graftOptions.defaultProps)),
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
              <FormControl isInvalid={!!errors.name}>
                <Input {...register('name')} placeholder="Name" autoComplete="off" />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.route}>
                <Input {...register('route')} placeholder="Route" autoComplete="off" />
                <FormErrorMessage>{errors.route?.message}</FormErrorMessage>
              </FormControl>
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
