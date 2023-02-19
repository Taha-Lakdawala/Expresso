import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { ChatState } from '../context/chatProvider';
import SideDrawer from '../components/misc/sideDrawer';
import MyChats from '../components/MyChats'
import ChatBox from '../components/misc/chatBox'

const ChatPage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);
    
    return (
        <div style={{ width: "100%"}}>
            {user && <SideDrawer/>}
            <Box
                display="flex"
                justifyContent="space-between"
                w="100%"
                h="91.5vh"
                p="15px"
            >
                {user && <MyChats fetchAgain={fetchAgain}/>}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
            </Box>
      </div>
    );
};

export default ChatPage;