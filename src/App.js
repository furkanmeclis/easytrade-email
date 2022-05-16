import React from 'react';
import {
  Input,
  Container,
  Button,
  Tooltip,
  useDisclosure,
  Textarea,
  InputGroup,
} from '@chakra-ui/react';
import { FcAddressBook } from 'react-icons/fc';
import ContactModal from './ContactModal';
export default function App({ userId }) {
  const [content, setContent] = React.useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <ContactModal isOpen={isOpen} onClose={onClose} userId={userId} />
      <Container maxW="600px" py={5} px={4} rounded={'lg'}>
        <Input placeholder="Gönderen Adı" mb={3} />

        <InputGroup>
          <Tooltip hasArrow label="Email adreslerini virgül ile ayırın">
            <Input w="full" placeholder="Email Adresleri" mb={3} />
          </Tooltip>
          <Button
            leftIcon={<FcAddressBook />}
            px={6}
            ml={3}
            onClick={e => onOpen()}
            colorScheme="orange"
          >
            Defterden Ekle
          </Button>
        </InputGroup>

        <Input placeholder="Konu" mb={3} />
        <Textarea
          mb={3}
          defaultValue={content}
          onChange={e => setContent(e.target.value)}
          rows="10"
          placeholder="Email İçeriği"
        ></Textarea>
      </Container>
    </>
  );
}
