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
import QueryBuilder from './QueryBuilder';

export default function QueryBuilderDialog({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Query Builder</ModalHeader>
        <ModalCloseButton />
        <ModalBody sx={{ maxHeight: 500, overflowY: 'auto' }}>
          <QueryBuilder />
        </ModalBody>
        <ModalFooter>
          <Button>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
