import React from 'react';
import {
  Input,
  Container,
  Button,
  Tooltip,
  useDisclosure,
  InputGroup,
  Box,
  Spinner,
  Text,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Center,
} from '@chakra-ui/react';
import { FcAddressBook } from 'react-icons/fc';
import EmailEditor from 'react-email-editor';
import ContactModal from './ContactModal';
import { toast } from 'react-toastify';
export default function App({ userId }) {
  const endpoint = 'https://app.myeasytrades.com/user/send-email';
  const [senderName, setSenderName] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [stringEmail, setStringEmail] = React.useState('');
  const [content, setContent] = React.useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [designData, setDesignData] = React.useState({});
  const [emails, setEmails] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [sending, setSending] = React.useState(false);
  const emailEditorRef = React.useRef(null);
  const finishedLoading = () => {
    setLoading(false);
  };
  const onLoad = () => {
    if (Object.keys(designData).length > 0)
      emailEditorRef.current.editor.loadDesign(designData);
  };
  const exportHtml = async () => {
    return;
  };
  const sendEmail = async () => {
    setSending(true);
    if (senderName === '') toast.warn('Gönderici Adı Boş Bırakılamaz');
    if (stringEmail === '' && emails.length === 0)
      toast.warn('Lütfen Bir Alıcı Ekleyin');
    if (subject === '') toast.warn('Konu Boş Bırakılamaz');
    if (
      senderName === '' ||
      stringEmail === '' &&
      emails.length === 0 ||
      subject === ''
    ){return setSending(false);}
      
    await emailEditorRef.current.editor.exportHtml(data => {
      const { design, html } = data;

      const divider = stringEmail.slice(-1) === ',' ? '' : '';
      const buyers = stringEmail + divider + emails.join(',');
      const formData = new FormData();
      formData.append('sender_name', senderName);
      formData.append('subject', subject);
      formData.append('body', html);
      formData.append('email_adresses', buyers);
      fetch('https://app.myeasytrades.com/user/send-email', {
        method: 'POST',
        body: formData,
      })
        .then(e => e.json())
        .then(e => {
          toast(e.message, { type: e.type });
        })
        .catch(e => toast.error('Bir Sorun Oluştu Email Gönderilemedi'))
        .finally(e => setSending(false));
    });
  };
  return (
    <>
      <ContactModal
        isOpen={isOpen}
        onClose={onClose}
        userId={userId}
        setEmails={setEmails}
      />
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>Bilgiler</Tab>
          <Tab>Editör</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Container maxW="600px" py={5} px={4} rounded={'lg'}>
              <Input
                placeholder="Gönderen Adı"
                defaultValue={senderName}
                onChange={e => setSenderName(e.target.value)}
                mb={3}
              />

              <InputGroup>
                <Tooltip hasArrow label="Email adreslerini virgül ile ayırın">
                  <Input
                    w="full"
                    placeholder="Email Adresleri"
                    defaultValue={stringEmail}
                    onChange={e => setStringEmail(e.target.value)}
                    mb={3}
                  />
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

              <Input
                placeholder="Konu"
                defaultValue={subject}
                onChange={e => setSubject(e.target.value)}
                mb={3}
              />
            </Container>
          </TabPanel>
          <TabPanel>
            <Box hidden={!loading} px={3}>
              <Flex
                justifyContent="center"
                alignItems="center"
                w="full"
                h="full"
              >
                <Spinner />
                <Text ml="2">Yükleniyor...</Text>
              </Flex>
            </Box>
            <Box hidden={loading}>
              <EmailEditor
                onReady={finishedLoading}
                ref={emailEditorRef}
                onLoad={onLoad}
                options={{
                  locale: 'tr-TR',
                }}
              />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Divider my={3} />
      <Center>
        <Button
          onClick={sendEmail}
          colorScheme="green"
          isLoading={sending}
          loadingText="Email Gönderiliyor"
        >
          Email Gönder
        </Button>
      </Center>
    </>
  );
}
