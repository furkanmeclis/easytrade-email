import React from 'react';
import {
  Input,
  Container,
  Button,
  Tooltip,
  useDisclosure,
  Textarea,
  InputGroup,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Text,
  Flex,
} from '@chakra-ui/react';
import { FcAddressBook } from 'react-icons/fc';
import EmailEditor from 'react-email-editor';
import ContactModal from './ContactModal';
export default function App({ userId }) {
  const [content, setContent] = React.useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [emails, setEmails] = React.useState([]);
  const EmailContent = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = React.useState(true);
    const emailEditorRef = React.useRef(null);
    const finishedLoading = () => {
      setLoading(false);
    };
    const exportHtml = () => {
      emailEditorRef.current.editor.exportHtml(({html}) => {
        setContent(html)
      });
      onClose();
    }
    return (
      <>
        <Button onClick={onOpen}>Email Editörü</Button>

        <Modal isOpen={isOpen} size={loading ? 'xs' : 'full'} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
          <ModalHeader>Email Editörü</ModalHeader>
            {loading ? (
              ''
            ) : (
              <>
                
                <ModalCloseButton />
              </>
            )}
            <ModalBody>
              <Box hidden={!loading}>
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  w="full"
                  h="full"
                  mx={3}
                >
                  <Spinner />
                  <Text ml="2">Yükleniyor...</Text>
                </Flex>
              </Box>
              <Box hidden={loading}>
                <EmailEditor
                  onReady={finishedLoading}
                  ref={emailEditorRef}
                  options={{
                    locale: 'tr-TR',
                  }}
                />
              </Box>
            </ModalBody>
            {loading === false ? (
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Temizle
                </Button>
                <Button variant="ghost" onClick={exportHtml}>Kaydet</Button>
              </ModalFooter>
            ) : (
              ''
            )}
          </ModalContent>
        </Modal>
      </>
    );
  };
  return (
    <>
      <ContactModal
        isOpen={isOpen}
        onClose={onClose}
        userId={userId}
        setEmails={setEmails}
      />
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
        <Box>
          <EmailContent />
        </Box>
        <Textarea
          mb={3}
          value={content}
          onChange={e => setContent(e.target.value)}
          rows="10"
          placeholder="Email İçeriği"
        ></Textarea>
      </Container>
    </>
  );
}
