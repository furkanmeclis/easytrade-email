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
  Spinner,
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
  const [loading,setLoading] = React.useState(true);
  const [createGroup, setCreateGroup] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState({});
  const [selectedUsersForGroup, setSelectedUsersForGroup] = React.useState({});
  const [selectedGroups, setSelectedGroups] = React.useState({});
  const [groupName, setGroupName] = React.useState('');

  const initDatabase = async () => {
    setLoading(true);
    db.collection('easytrade')
      .doc('email')
      .collection(props.userId)
      .doc('users')
      .collection('list')
      .onSnapshot(async snapshots => {
        let usersCache = [];
        snapshots.forEach(async doc => {
          let c = doc.data();
          c.id = doc.id;
          setSelectedUsers({ ...selectedUsers, [c.id]: false });
          setSelectedUsersForGroup({ ...selectedUsersForGroup, [c.id]: false });
          usersCache.push(c);
        });
        setUsers(usersCache);
        setLoading(false);
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
        setLoading(false);
      });
  };
  React.useEffect(() => {
    initDatabase();
  }, []);
  const NewUser = () => {
    const [namee, setNamee] = React.useState('');
    const [email, setEmail] = React.useState('');
    const addUser = () => {
      if (namee === '') return toast.warning('Bo?? Kullan??c?? ??smi Eklenemez');
      if (email === '') return toast.warning('Bo?? Email Eklenemez');
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
          toast.success(namee + ' Adl?? Kullan??c?? Eklendi');
        })
        .catch(e => toast.error('Kullan??c?? Eklenemedi'));
    };
    return (
      <InputGroup>
        <Input
          placeholder="Kullan??c?? Ad??"
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
      if (name === '') return toast.warning('Bo?? Kullan??c?? Ad?? G??ncellenemez');
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
            user.name + ' Kullan??c?? ??smi ' + name + ' Olarak G??ncellendi'
          );
        })
        .catch(e => {
          toast.error('G??ncelleme Kaydedilemedi');
        });
    };
    const saveEmail = email => {
      if (email === '') return toast.warning('Bo?? Email G??ncellenemez');
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
            user.email + ' Email Adresi ' + email + ' Olarak G??ncellendi'
          );
        })
        .catch(e => {
          toast.error('G??ncelleme Kaydedilemedi');
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
          toast.success(user.name + ' Adl?? Kullan??c?? Silindi');
        })
        .catch(e => {
          toast.error('Silme ????lemi Ba??ar??s??z');
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
                  ? 'Listeden ????kar'
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
                  ? 'Gruptan ????kar'
                  : 'Gruba Ekle'}
              </Button>
            </ButtonGroup>
          </Td>
        </Tr>
      </>
    );
  };
  const saveGroup = async () => {
    if (groupName === '') return toast.warning('Grup ??smi Bo?? Kaydedilemez');
    let selectedUsers = [];
    await Promise.all(
      Object.entries(selectedUsersForGroup).map(([key, value]) => {
        if (value) selectedUsers.push(key);
      })
    );
    if (selectedUsers.length === 0)
      return toast.warning('Grup ??yesi Se??ilmeden Kaydedilemez');

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
        toast.success(groupName + ' Adl?? Grup Olu??turuldu');
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
        toast.error('Grup Olu??turulamad??');
      });
  };
  const GroupRowTable = ({ group }) => {
    const saveName = name => {
      if (name === '') return toast.warning('Bo?? Grup Ad?? G??ncellenemez');
      if (name === group.name) return;
      db.collection('easytrade')
        .doc('email')
        .collection(props.userId)
        .doc('groups')
        .collection('list')
        .doc(group.id)
        .update({
          name: name,
        })
        .then(e => {
          toast.success(
            group.name + ' Grup ??smi ' + name + ' Olarak G??ncellendi'
          );
        })
        .catch(e => {
          toast.error('G??ncelleme Kaydedilemedi');
        });
    };
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
          toast.success(group.name + ' Adl?? Grup Silindi');
        })
        .catch(e => {
          toast.error('Silme ????lemi Ba??ar??s??z');
        });
    };

    return (
      <>
        <Tr bg={selectedGroups[group.id] === true ? 'green.100' : ''}>
          <Td>
            <Avatar size="sm" name={group.name} />
          </Td>
          <Td>{group.users.length}</Td>
          <Td>
            <Editable defaultValue={group.name} onSubmit={saveName}>
              <EditablePreview />
              <EditableInput />
            </Editable>
          </Td>

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
                  ? 'Listeden ????kar'
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
  const onClose = async () => {
    let selectedUsersGet = [];
    await Promise.all(
      Object.entries(selectedUsers).map(([key, value]) => {
        if (value === true) {
          const filterTask = users.filter(value => {
            return value.id === key;
          });
          if (filterTask.length !== 0) {
            selectedUsersGet.push(filterTask[0].email);
          }
        }
      })
    );
    props.setEmails(selectedUsersGet);
    props.onClose();
  };
  const SelectButton = () => {
    return (
      <>
        <Button
          colorScheme={
            users.length ===
            Object.entries(selectedUsers).filter(
              ([key, value]) => value === true
            ).length
              ? 'red'
              : 'green'
          }
          mb={3}
          leftIcon={
            users.length ===
            Object.entries(selectedUsers).filter(
              ([key, value]) => value === true
            ).length ? (
              <FcDeleteDatabase />
            ) : (
              <FcAcceptDatabase />
            )
          }
          size="sm"
          onClick={async e => {
            if (
              users.length ===
              Object.entries(selectedUsers).filter(
                ([key, value]) => value === true
              ).length
            ) {
              let userObject = {};
              await Promise.all(
                users.map(user => {
                  userObject[user.id] = false;
                })
              );
              setSelectedUsers(userObject);
            } else {
              let userObject = {};
              await Promise.all(
                users.map(user => {
                  userObject[user.id] = true;
                })
              );
              setSelectedUsers(userObject);
            }
          }}
        >
          {users.length ===
          Object.entries(selectedUsers).filter(([key, value]) => value === true)
            .length
            ? 'T??m??n?? Kald??r'
            : 'T??m??n?? Se??'}
        </Button>
      </>
    );
  };
  const SelectButtonGroupCreate = () => {
    return (
      <>
        <Button
          colorScheme={
            users.length ===
            Object.entries(selectedUsersForGroup).filter(
              ([key, value]) => value === true
            ).length
              ? 'red'
              : 'green'
          }
          mt={3}
          leftIcon={
            users.length ===
            Object.entries(selectedUsersForGroup).filter(
              ([key, value]) => value === true
            ).length ? (
              <FcDeleteDatabase />
            ) : (
              <FcAcceptDatabase />
            )
          }
          size="sm"
          onClick={async e => {
            if (
              users.length ===
              Object.entries(selectedUsersForGroup).filter(
                ([key, value]) => value === true
              ).length
            ) {
              let userObject = {};
              await Promise.all(
                users.map(user => {
                  userObject[user.id] = false;
                })
              );
              setSelectedUsersForGroup(userObject);
            } else {
              let userObject = {};
              await Promise.all(
                users.map(user => {
                  userObject[user.id] = true;
                })
              );
              setSelectedUsersForGroup(userObject);
            }
          }}
        >
          {users.length ===
          Object.entries(selectedUsersForGroup).filter(([key, value]) => value === true)
            .length
            ? 'T??m??n?? Kald??r'
            : 'T??m??n?? Se??'}
        </Button>
      </>
    );
  };
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Email Defteri</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
            {loading ? <>
            <Flex justifyContent={"center"}><Spinner /> <Text ml="2">Y??kleniyor...</Text></Flex>
            </>:<>
            <ButtonGroup variant={'solid'} w="full">
              <Button
                leftIcon={<FcContacts />}
                isActive={route === 'users'}
                onClick={e => setRoute('users')}
                colorScheme="blackAlpha"
              >
                Kullan??c??lar
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
                          Email Defterinize Kullan??c?? Eklenmemi??.
                        </AlertDescription>
                      </Alert>
                    </>
                  ) : (
                    <>
                      <SelectButton />
                      <TableContainer>
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Avatar</Th>
                              <Th>Kullan??c?? Ad??</Th>
                              <Th>Email Adresi</Th>
                              <Th>????lemler</Th>
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
                          Grup Olu??tur
                        </Button>
                      </Flex>

                      <Divider my={3} />
                      {groups.length === 0 ? (
                        <>
                          <Alert status="warning">
                            <AlertIcon />

                            <AlertDescription>
                              Email Defterinize Grup Eklenmemi??.
                            </AlertDescription>
                          </Alert>
                        </>
                      ) : (
                        <TableContainer my={3}>
                          <Table variant="simple">
                            <Thead>
                              <Tr>
                                <Th>Avatar</Th>
                                <Th>??ye Say??s??</Th>
                                <Th>Grup ??smi</Th>
                                <Th>????lemler</Th>
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
                        placeholder="Grubunuza Bir ??sim Verin"
                        defaultValue={groupName}
                        onChange={e => setGroupName(e.target.value)}
                      />
                      {users.length === 0 ? (
                        <>
                          <Alert status="warning">
                            <AlertIcon />

                            <AlertDescription>
                              Email Defterinize Kullan??c?? Eklenmemi??.
                            </AlertDescription>
                          </Alert>
                        </>
                      ) : (
                        <>
                          <SelectButtonGroupCreate />
                          <TableContainer my={3}>
                            <Table variant="simple">
                              <Thead>
                                <Tr>
                                  <Th>Avatar</Th>
                                  <Th>Kullan??c?? Ad??</Th>
                                  <Th>Email Adresi</Th>
                                  <Th>????lemler</Th>
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
                          Grubu Olu??tur
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
                          Vazge??
                        </Button>
                      </ButtonGroup>
                    </>
                  )}
                </>
              )}
            </Box></>}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={onClose}>
              Se??ilileri Ekle {/* Email var yok kontrol?? sa??lanacak */}
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
