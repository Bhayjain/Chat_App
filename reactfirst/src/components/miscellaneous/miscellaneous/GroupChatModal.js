import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
// import { ChatState } from "../../Context/ChatProvider";
import { ChatState } from "../../../Context/ChatProvider";
import UserBadgeItem from "../../userAvatar/UserBadgeItem";
// import UserListItem from "../../userAvatar/UserListItem";
// import UserBadgeItem from "../userAvatar/UserBadgeItem";
// import UserListItem from "../userAvatar/UserListItem";
import { Avatar } from "@chakra-ui/avatar";
import {  Text } from "@chakra-ui/layout";
import './modal.css'
import React from "react";
// import { server_link } from "../../../urllink";


const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  

  const { user, chats, setChats } = ChatState();

  console.log(chats)

  const handleGroup = (userToAdd) => {
    console.log("vhdsa", userToAdd);

    if (selectedUsers.includes(userToAdd)) {


      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
    console.log("setSelectedUsers", selectedUsers);

  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`https://tall-a-tiv.onrender.com/api/user?search=${search}`, config);
      // console.log(data);
      setLoading(false);
      setSearchResult(data);
      console.log("abhay", searchResult);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post( 

        `https://tall-a-tiv.onrender.com/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },

        
        config
      );


  
      console.log("vdsbv", data);
      fetchChats();
      // setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000, 
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`https://tall-a-tiv.onrender.com/api/chat`, config);
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


  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered  >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
           {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              <div className="mycalendar_new" style={{ height: "250px", width:"100%",backgroundColor:"white"  }}>

              {searchResult.map((value, index) => {
                return (
                  <Box key={index}
                    // onClick={handleFunction}
                    className=""
                    cursor="pointer"
                    bg="#E8E8E8"
                    _hover={{
                      background: "#38B2AC",
                      color: "white",
                    }}
                    width="100%"
                    display="flex"
                    alignItems="center"
                    color="black"
                    px={3}
                    py={2}
                    mb={2}
                    borderRadius="lg"
                    onClick={() => handleGroup(value)}
                  >
                    <Avatar
                      mr={2}
                      size="sm"
                      cursor="pointer"
                      name={value.name}
                      src={value.pic}
                    />
                    <Box>
                      <Text fontSize={"14px"}>{value.name}</Text>
                      <Text fontSize="12px">
                        <b>Email : </b>
                        {value.email}
                      </Text>
                    </Box>


                  </Box>
                )

              })}
            </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue">
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
