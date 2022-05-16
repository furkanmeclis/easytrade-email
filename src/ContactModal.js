import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  ButtonGroup,
  Divider,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  InputGroup,
  Input,
  Editable,
  EditableInput,
  EditablePreview,
  Alert,
  AlertIcon,
  AlertDescription,
  Flex,
  Text,
  Avatar,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { db } from './firebase';
import {
  FcCollaboration,
  FcContacts,
  FcPlus,
  FcFullTrash,
  FcCancel,
  FcAcceptDatabase,
  FcDeleteDatabase,
} from 'react-icons/fc';
const ContactModal = props => {
  const [route, setRoute] = React.useState('users');
  const [users, setUsers] = React.useState([]);
  const [groups, setGroups] = React.useState([]);
  const [createGroup, setCreateGroup] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState({});
  const [selectedUsersForGroup, setSelectedUsersForGroup] = React.useState({});
  const [selectedGroups, setSelectedGroups] = React.useState({});
  const [groupName, setGroupName] = React.useState('');
  const initDatabase = () => {
    db.collection('easytrade')
      .doc('email')
      .collection(props.userId)
      .doc('users')
      .collection('list')
      .onSnapshot(snapshots => {
        let usersCache = [];
        snapshots.forEach(doc => {
          let c = doc.data();
          c.id = doc.id;
          setSelectedUsers({ ...selectedUsers, [c.id]: false });
          setSelectedUsersForGroup({ ...selectedUsersForGroup, [c.id]: false });
          usersCache.push(c);
        });
        setUsers(usersCache);
      });
    db.collection('easytrade')
      .doc('email')
      .collection(props.userId)
      .doc('groups')
      .collection('list')
      .onSnapshot(snapshots => {
        let groupCache = [];
        snapshots.forEach(doc => {
          let c = doc.data();
          c.id = doc.id;
          groupCache.push(c);
        });
        setGroups(groupCache);
      });
  };
  React.useEffect(() => {
    initDatabase();
  }, []);
  const NewUser = () => {
    const [namee, setNamee] = React.useState('');
    const [email, setEmail] = React.useState('');
    const addUser = () => {
      if (namee === '') return toast.warning('Boş Kullanıcı İsmi Eklenemez');
      if (email === '') return toast.warning('Boş Email Eklenemez');
      db.collection('easytrade')
        .doc('email')
        .collection(props.userId)
        .doc('users')
        .collection('list')
        .add({
          name: namee,
          email: email,
        })
        .then(e => {
          toast.success(namee + ' Adlı Kullanıcı Eklendi');
        })
        .catch(e => toast.error('Kullanıcı Eklenemedi'));
    };
    return (
      <InputGroup>
        <Input
          placeholder="Kullanıcı Adı"
          defaultValue={namee}
          onChange={e => setNamee(e.target.value)}
          type="text"
        />
        <Input
          ml="2"
          type="email"
          placeholder="Email Adresi"
          defaultValue={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Button
          ml="2"
          px={7}
          onClick={addUser}
          colorScheme="blackAlpha"
          leftIcon={<FcPlus />}
        >
          Ekle
        </Button>
      </InputGroup>
    );
  };
  const RowUserTable = ({ user }) => {
    const saveName = name => {
      if (name === '') return toast.warning('Boş Kullanıcı Adı Güncellenemez');
      if (name === user.name) return;
      db.collection('easytrade')
        .doc('email')
        .collection(props.userId)
        .doc('users')
        .collection('list')
        .doc(user.id)
        .update({
          name: name,
        })
        .then(e => {
          toast.success(
            user.name + ' Kullanıcı İsmi ' + name + ' Olarak Güncellendi'
          );
        })
        .catch(e => {
          toast.error('Güncelleme Kaydedilemedi');
        });
    };
    const saveEmail = email => {
      if (email === '') return toast.warning('Boş Email Güncellenemez');
      if (email === user.email) return;
      db.collection('easytrade')
        .doc('email')
        .collection(props.userId)
        .doc('users')
        .collection('list')
        .doc(user.id)
        .update({
          email: email,
        })
        .then(e => {
          toast.success(
            user.email + ' Email Adresi ' + email + ' Olarak Güncellendi'
          );
        })
        .catch(e => {
          toast.error('Güncelleme Kaydedilemedi');
        });
    };
    const deleteUser = () => {
      db.collection('easytrade')
        .doc('email')
        .collection(props.userId)
        .doc('users')
        .collection('list')
        .doc(user.id)
        .delete()
        .then(e => {
          toast.success(user.name + ' Adlı Kullanıcı Silindi');
        })
        .catch(e => {
          toast.error('Silme İşlemi Başarısız');
        });
    };
    return (
      <>
        <Tr bg={selectedUsers[user.id] === true ? 'green.100' : ''}>
          <Td>
            <Avatar size="sm" name={user.name} />
          </Td>
          <Td>
            <Editable defaultValue={user.name} onSubmit={saveName}>
              <EditablePreview />
              <EditableInput />
            </Editable>
          </Td>
          <Td>
            <Editable defaultValue={user.email} onSubmit={saveEmail}>
              <EditablePreview />
              <EditableInput type="email" />
            </Editable>
          </Td>
          <Td>
            <ButtonGroup size="sm" spacing={3}>
              <Button
                colorScheme={
                  selectedUsers[user.id] === true ? 'orange' : 'green'
                }
                leftIcon={
                  selectedUsers[user.id] === true ? <FcCancel /> : <FcPlus />
                }
                onClick={e =>
                  setSelectedUsers({
                    ...selectedUsers,
                    [user.id]: !selectedUsers[user.id],
                  })
                }
              >
                {selectedUsers[user.id] === true
                  ? 'Listeden Çıkar'
                  : 'Listeye Ekle'}
              </Button>
              <Button
                leftIcon={<FcFullTrash />}
                colorScheme="red"
                onClick={deleteUser}
              >
                Sil
              </Button>
            </ButtonGroup>
          </Td>
        </Tr>
      </>
    );
  };
  const RowGroupTable = ({ user }) => {
    return (
      <>
        <Tr bg={selectedUsersForGroup[user.id] === true ? 'green.100' : ''}>
          <Td>
            <Avatar size="sm" name={user.name} />
          </Td>
          <Td>{user.name}</Td>
          <Td>{user.email}</Td>
          <Td>
            <ButtonGroup size="sm" spacing={3}>
              <Button
                colorScheme={
                  selectedUsersForGroup[user.id] === true ? 'orange' : 'green'
                }
                leftIcon={
                  selectedUsersForGroup[user.id] === true ? (
                    <FcCancel />
                  ) : (
                    <FcPlus />
                  )
                }
                onClick={e =>
                  setSelectedUsersForGroup({
                    ...selectedUsersForGroup,
                    [user.id]: !selectedUsersForGroup[user.id],
                  })
                }
              >
                {selectedUsersForGroup[user.id] === true
                  ? 'Gruptan Çıkar'
                  : 'Gruba Ekle'}
              </Button>
            </ButtonGroup>
          </Td>
        </Tr>
      </>
    );
  };
  const saveGroup = async () => {
    if (groupName === '') return toast.warning('Grup İsmi Boş Kaydedilemez');
    let selectedUsers = [];
    await Promise.all(
      Object.entries(selectedUsersForGroup).map(([key, value]) => {
        if (value) selectedUsers.push(key);
      })
    );
    if (selectedUsers.length === 0)
      return toast.warning('Grup Üyesi Seçilmeden Kaydedilemez');

    db.collection('easytrade')
      .doc('email')
      .collection(props.userId)
      .doc('groups')
      .collection('list')
      .add({
        name: groupName,
        users: selectedUsers,
      })
      .then(async e => {
        toast.success(groupName + ' Adlı Grup Oluşturuldu');
        let groupObject = {};
        await Promise.all(
          users.map(user => {
            groupObject[user.id] = false;
          })
        );
        setSelectedUsersForGroup(groupObject);
        setCreateGroup(false);
      })
      .catch(e => {
        toast.error('Grup Oluşturulamadı');
      });
  };
  const GroupRowTable = ({ group }) => {
    const deleteGroup = async () => {
      let o = {};
      await Promise.all(
        group.users.map(user => {
          o[user] = false;
        })
      );
      setSelectedUsers({ ...selectedUsers, ...o });
      db.collection('easytrade')
        .doc('email')
        .collection(props.userId)
        .doc('groups')
        .collection('list')
        .doc(group.id)
        .delete()
        .then(e => {
          toast.success(group.name + ' Adlı Grup Silindi');
        })
        .catch(e => {
          toast.error('Silme İşlemi Başarısız');
        });
    };
    return (
      <>
        <Tr bg={selectedGroups[group.id] === true ? 'green.100' : ''}>
          <Td>
            <Avatar size="sm" name={group.name} />
          </Td>
          <Td>{group.name}</Td>

          <Td>
            <ButtonGroup size="sm" spacing={3}>
              <Button
                colorScheme={
                  selectedGroups[group.id] === true ? 'orange' : 'green'
                }
                leftIcon={
                  selectedGroups[group.id] === true ? <FcCancel /> : <FcPlus />
                }
                onClick={async () => {
                  if (selectedGroups[group.id]) {
                    let o = {};
                    await Promise.all(
                      group.users.map(user => {
                        o[user] = false;
                      })
                    );
                    setSelectedGroups({ ...selectedGroups, [group.id]: false });
                    setSelectedUsers({ ...selectedUsers, ...o });
                  } else {
                    let o = {};
                    await Promise.all(
                      group.users.map(user => {
                        o[user] = true;
                      })
                    );
                    setSelectedGroups({ ...selectedGroups, [group.id]: true });
                    setSelectedUsers({ ...selectedUsers, ...o });
                  }
                }}
              >
                {selectedGroups[group.id] === true
                  ? 'Listeden Çıkar'
                  : 'Listeye Ekle'}
              </Button>
              <Button
                leftIcon={<FcFullTrash />}
                colorScheme="red"
                onClick={deleteGroup}
              >
                Sil
              </Button>
            </ButtonGroup>
          </Td>
        </Tr>
      </>
    );
  };
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Email Defteri</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ButtonGroup variant={'solid'} w="full">
              <Button
                leftIcon={<FcContacts />}
                isActive={route === 'users'}
                onClick={e => setRoute('users')}
                colorScheme="blackAlpha"
              >
                Kullanıcılar
              </Button>
              <Button
                leftIcon={<FcCollaboration />}
                isActive={route === 'groups'}
                onClick={e => setRoute('groups')}
                colorScheme="blackAlpha"
              >
                Gruplar
              </Button>
            </ButtonGroup>
            <Divider my={3} />
            <Box>
              {route === 'users' ? (
                <>
                  <NewUser />
                  <Divider my={3} />
                  {users.length === 0 ? (
                    <>
                      <Alert status="warning">
                        <AlertIcon />

                        <AlertDescription>
                          Email Defterinize Kullanıcı Eklenmemiş.
                        </AlertDescription>
                      </Alert>
                    </>
                  ) : (
                    <>
                      <TableContainer>
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Avatar</Th>
                              <Th>Kullanıcı Adı</Th>
                              <Th>Email Adresi</Th>
                              <Th>İşlemler</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {users.map(user => {
                              return <RowUserTable key={user.id} user={user} />;
                            })}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </>
                  )}
                </>
              ) : (
                <>
                  {createGroup === false ? (
                    <>
                      <Flex justifyContent={'space-between'}>
                        <Text></Text>
                        <Button
                          float="right"
                          colorScheme="blackAlpha"
                          leftIcon={<FcPlus />}
                          onClick={e => setCreateGroup(true)}
                        >
                          Grup Oluştur
                        </Button>
                      </Flex>

                      <Divider my={3} />
                      {groups.length === 0 ? (
                        <>
                          <Alert status="warning">
                            <AlertIcon />

                            <AlertDescription>
                              Email Defterinize Grup Eklenmemiş.
                            </AlertDescription>
                          </Alert>
                        </>
                      ) : (
                        <TableContainer my={3}>
                          <Table variant="simple">
                            <Thead>
                              <Tr>
                                <Th>Avatar</Th>
                                <Th>Grup İsmi</Th>

                                <Th>İşlemler</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {groups.map(group => {
                                return (
                                  <GroupRowTable key={group.id} group={group} />
                                );
                              })}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      )}
                    </>
                  ) : (
                    <>
                      <Input
                        placeholder="Grubunuza Bir İsim Verin"
                        defaultValue={groupName}
                        onChange={e => setGroupName(e.target.value)}
                      />
                      {users.length === 0 ? (
                        <>
                          <Alert status="warning">
                            <AlertIcon />

                            <AlertDescription>
                              Email Defterinize Kullanıcı Eklenmemiş.
                            </AlertDescription>
                          </Alert>
                        </>
                      ) : (
                        <>
                          <ButtonGroup my={3} size="sm">
                            <Button
                              colorScheme="green"
                              leftIcon={<FcAcceptDatabase />}
                              onClick={async e => {
                                let groupObject = {};
                                await Promise.all(
                                  users.map(user => {
                                    groupObject[user.id] = true;
                                  })
                                );
                                setSelectedUsersForGroup(groupObject);
                              }}
                            >
                              Tümünü Seç
                            </Button>
                            <Button
                              colorScheme="red"
                              leftIcon={<FcDeleteDatabase />}
                              onClick={async e => {
                                let groupObject = {};
                                await Promise.all(
                                  users.map(user => {
                                    groupObject[user.id] = false;
                                  })
                                );
                                setSelectedUsersForGroup(groupObject);
                              }}
                            >
                              Tümünü Kaldır
                            </Button>
                          </ButtonGroup>
                          <TableContainer my={3}>
                            <Table variant="simple">
                              <Thead>
                                <Tr>
                                  <Th>Avatar</Th>
                                  <Th>Kullanıcı Adı</Th>
                                  <Th>Email Adresi</Th>
                                  <Th>İşlemler</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {users.map(user => {
                                  return (
                                    <RowGroupTable key={user.id} user={user} />
                                  );
                                })}
                              </Tbody>
                            </Table>
                          </TableContainer>
                        </>
                      )}
                      <ButtonGroup spacing={3}>
                        <Button
                          colorScheme="green"
                          leftIcon={<FcPlus />}
                          onClick={saveGroup}
                        >
                          Grubu Oluştur
                        </Button>
                        <Button
                          colorScheme="orange"
                          leftIcon={<FcCancel />}
                          onClick={async e => {
                            let groupObject = {};
                            await Promise.all(
                              users.map(user => {
                                groupObject[user.id] = false;
                              })
                            );
                            setSelectedUsersForGroup(groupObject);
                            setCreateGroup(false);
                          }}
                        >
                          Vazgeç
                        </Button>
                      </ButtonGroup>
                    </>
                  )}
                </>
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={props.onClose}>
              Kapat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

ContactModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default ContactModal;
