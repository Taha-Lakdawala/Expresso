import React, { useEffect, useState } from 'react'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { getSender, getSenderFull } from '../config/ChatLogics';
import { ChatState } from '../context/chatProvider'
import ProfileModal from './misc/ProfileModal';
import UpdateGroupChatModal from './misc/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import './style.css';
import io from 'socket.io-client'
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import { ArrowBackIcon } from "@chakra-ui/icons";

const ENDPOINT = "https://localhost:8800";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const toast = useToast();
    const [socketConnected, setsocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        renderSettings:{
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const {user, selectedChat, setSelectedChat, notification, setNotification} = ChatState();

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

            socket.emit("join chat", selectedChat._id);

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

    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setsocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));

      // eslint-disable-next-line
    }, []);


    useEffect (() => {
        fetchMessages();
        selectedChatCompare = selectedChat; 
        // eslint-disable-next-line
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }
            else{
                setMessages([...messages, newMessageRecieved]);
            }
        })
    })

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage){
            socket.emit("stop typing", selectedChat._id)
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
                socket.emit("new message", data);
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
        if(!socketConnected) return;

        if(!typing){
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing ){
                socket.emit("stop typing", selectedChat._id );
                setTyping(false);
            }
        }, timerLength)
    };

    return (
      <>
        {selectedChat ? (
          <>
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              pb={3}
              px={2}
              w="100%"
              fontFamily="Work sans"
              display="flex"
              justifyContent={{ base: "space-between" }}
              alignItems="center"
            >
              <IconButton
                display={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
              />
              {messages &&
                (!selectedChat.isGroupChat ? (
                  <>
                    {getSender(user, selectedChat.users)}
                    <ProfileModal
                      user={getSenderFull(user, selectedChat.users)}
                    />
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
              overflowY="hidden"
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
              <FormControl
                onKeyDown={sendMessage}
                id="first-name"
                isRequired
                mt={3}
              >
                {istyping ? (
                  <div>
                    <Lottie
                      options={defaultOptions}
                      width={70}
                      style={{ marginBottom: 15, marginLeft: 0, height: 30 }}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter message!"
                  value={newMessage}
                  onChange={typingHandler}
                />
              </FormControl>
            </Box>
          </>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            h="100%"
          >
            <Text fontSize="1xl" pb={3} fontFamily="Work sans">
              Click on a user to start chatting!
            </Text>
          </Box>
        )}
      </>
    );
};

export default SingleChat;