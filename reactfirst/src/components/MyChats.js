import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
// import { getSender } from "../config/ChatLogics";
// import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { getSender } from "../config/ChatLogics";
import './mychat.css'
import { Avatar } from "@chakra-ui/avatar";
import React from "react";
// import { server_link } from "../urllink";




const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/chat`, config);
      console.log("vdsbv", data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    // <div style={{height:"100%", width:"100%"}}>
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      style={{ height: "100%", backgroundColor: " rgb(92 79 129)", borderColor: "rgb(92 79 129)" }}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        // style={{height:"87%"}}
        style={{ backgroundColor: " rgb(92 79 129)", borderColor: "rgb(92 79 129)", color:"white" }}


      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            backgroundColor={"rgb(81 71 109)"}
            color={"white"}
            className="my_hover_group"
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
        className="over-hidden mycalendar "
        style={{ backgroundColor: " rgb(92 79 129)", borderColor: "rgb(92 79 129)" }}


      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "rgb(239 170 134)" : "rgb(81 71 109)"}
                color={selectedChat === chat ? "white" : "white"}
                px={3}
                py={2}
                borderColor={selectedChat === chat ? "rgb(239 170 134)" : "rgb(92 79 129)"}
                borderRadius="lg"
                key={chat._id}
                className="over-hidden mycalendar class_chat "
              // style={{height:"87%"}}

              >

                <div style={{ display: "inline-flex", alignItems: "center" }}>
                  <div>


                    <Avatar
                      mr={2}
                      size="sm"
                      cursor="pointer"
                      // name={value.name}
                      src={chat.pic}
                    />
                    {/* <Text>
                  {!chat.isGroupChat
                    
                </Text> */}
                  </div>
                  <div>
                    <Text style={{ fontSize: "14px" }}>
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>
                    {chat.latestMessage && (
                      <Text style={{ fontSize: "12px" }}>
                        <b>{chat.latestMessage.sender.name} : </b>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    )}

                  </div>
                </div>

              </Box>
            ))}
          </Stack>
        ) : (
          "")}
      </Box>
    </Box>
    // </div>
  );
};

export default MyChats;
