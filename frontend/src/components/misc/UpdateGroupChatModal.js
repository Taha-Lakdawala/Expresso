import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../context/chatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setgroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const toast = useToast();

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleRemove= async (user1) => {
        if (!selectedChat.groupAdmin.some(item => item._id === user._id) && user1._id !== user._id ){
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`
                },
            };
            const {data} = await axios.put(`/api/chat/groupremove`, {
                chatId: selectedChat._id,
                userId: user1._id,
            }, config);

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch(error) {
            toast({
                title: "Error!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);

        }
        setgroupChatName("");
    }

    const handleAddUser = async (user1) => {
        if(selectedChat.users.find((u) => u._id === user1._id)){
            toast({
                title: "User already in the group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        if (!selectedChat.groupAdmin.some(item => item._id === user._id)){
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`
                },
            };
            const {data} = await axios.put(`/api/chat/groupadd`, {
                chatId: selectedChat._id,
                userId: user1._id,
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch(error) {
            toast({
                title: "Error!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);

        };
    }

    const handleRename= async() => {
        if(!groupChatName) return
        try {
            setRenameLoading(true);
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`
                },
            };
            const {data} = await axios.put(`/api/chat/rename`, {
                chatId: selectedChat._id,
                chatName: groupChatName,
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch(error) {
            toast({
                title: "Error!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
        setgroupChatName("");
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if(!query) {
            return;
        }
        try{
            setLoading(true);
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`
                },
            };
            const {data} = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);

        } catch(error) {
            toast({
                title: "Error!",
                description: "Failed to load the search results!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    return (
        <>
            <IconButton display={{base: "flex"}} icon={<ViewIcon/>} onClick={onOpen}/>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader
                    fontSize="35px"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent="center"
                >
                    {selectedChat.chatName}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody display="flex" flexDir="column" alignItems="center">
                    <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                        {selectedChat.users.map(u=>(
                            <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)}/>
                        ))}
                    </Box>
                    <FormControl display="flex">
                        <Input
                            placeholder="Chat Name"
                            mb={3}
                            value={groupChatName}
                            onChange={(e) => setgroupChatName(e.target.value)}
                        />
                        <Button
                            variant="solid"
                            colorScheme="teal"
                            ml={1}
                            isLoading={renameLoading}
                            onClick={handleRename}
                        >
                            Update
                        </Button>
                    </FormControl>
                    <FormControl>
                        <Input
                            placeholder="Add user to the group"
                            mb={1}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </FormControl>
                    {loading ? (
                        <Spinner size="lg" />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )
                    }
                </ModalBody>

                <ModalFooter>
                <Button colorScheme="red" onClick={() => handleRemove(user)}>
                    Leave Group
                </Button>
                </ModalFooter>
            </ModalContent>
            </Modal>
        </>
    )
};

export default UpdateGroupChatModal;