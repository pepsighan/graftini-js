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
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

export default function NewProjectDialog({ isOpen, onClose }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = useCallback((state) => {
    console.log(state);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>New Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input {...register('name')} />
          </ModalBody>
          <ModalFooter>
            <Button type="submit">Create</Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
