import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getSender, getSenderFull } from '../config/ChatLogics';
import { ChatState } from '../context/chatProvider'
import ProfileModal from './misc/profileModal';
import UpdateGroupChatModal from './misc/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import './style.css';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const toast = useToast();

    const {user, selectedChat, setSelectedChat} = ChatState();

    const fetchMessages = async () => {
        if (!selectedChat) return;
        
        try{
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`
                },
            };
            setLoading(true);
            
            const {data} = await axios.get(`/api/message/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false);
            
        } catch(error) {
            toast({
                title: "Error!",
                description: "Failed to send the message!" + error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        };
    };

    useEffect (() => {
        fetchMessages();
        // eslint-disable-next-line
    }, [selectedChat]);

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage){
            try{
                const config = {
                    headers:{
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const {data} = await axios.post(`/api/message`, {
                    content: newMessage,
                    chatId: selectedChat,
                }, config);
                setMessages([...messages, data]);
            } catch(error) {
                toast({
                    title: "Error!",
                    description: "Failed to send the message!" + error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
    };

    return (
        <>
        {selectedChat ? (
            <>
                <Text
                    fontSize={{ base: "28px", md: "30px"}}
                    pb={3}
                    px={2}
                    w="100%"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent={{base: "space-between"}}
                    alignItems="center"
                    >
                        <IconButton
                            display={{base: "flex", md: "none"}}
                            icon={<ArrowBackIcon/>}
                            onClick={() => setSelectedChat("")}
                        />
                            {messages && (!selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
                                </>
                                ) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpdateGroupChatModal
                                        fetchMessages={fetchMessages}
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                    />
                                </>
                            ))}
                </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflow="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div className="messages">
                                <ScrollableChat messages={messages} />
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}>
                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder="Enter message!"
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>
            </>
        ) : (
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                    Click on a user to start chatting
                </Text>
            </Box>
        )}
    </>
    );
};

export default SingleChat;