



import { Button } from "@chakra-ui/button";
// import { useDisclosure } from "@chakra-ui/hooks";
// import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
// import NotificationBadge from "react-notification-badge";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { ChatState } from "../../../Context/ChatProvider";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,

} from "@chakra-ui/menu";
import {

  useDisclosure,

} from "@chakra-ui/react";

import { useState } from "react";
import { useToast } from "@chakra-ui/toast";

import './sidedrawer.css'

// import Modal from 'react-modal';
import axios from "axios";
// import { toast } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import ProfileModal from "./ProfileModal";
import { Spinner } from "@chakra-ui/spinner";
// import NotificationBadge from "react-notification-badge";
// import { Effect } from "react-notification-badge";
import { getSender } from "../../../config/ChatLogics";




// const device_width =   window.innerWidth;
// var height =   window.innerHeight;
//  ////////console.log("admin_screen.height", height);
// const nav_height = document.querySelector('.rui-navbar-sticky').offsetHeight
// //  ////////console.log("admin_nav_height",nav_height);
// var my_height = height - nav_height;

import { Link, useNavigate, useHistory } from "react-router-dom";
import React, { useEffect } from "react";





const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};





const SideDrawer = ({ children }) => {

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const toast = useToast();



  const { user,

    notification,
    setNotification,
    chats,
    setChats,
    setSelectedChat,

  } = ChatState();
  const [showModal, setShowModal] = useState(false);
  // const [modalIsOpen, setIsOpen] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalIsOpen, setIsOpen] = React.useState(false);


  const navigate = useNavigate()


  console.log("userr_new", user);


  const toggleModal = () => {
    setShowModal(!showModal);
  };


  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }


  const logouthandlesr = () => {
    localStorage.removeItem("userInfo");
    navigate("/")

  }



  const handleSearch = async () => {
    console.log("SE", search);


    try {
      console.log("try");
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`http://localhost:5001/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
      console.log(data);
    } catch (error) {
      console.log("errorrrr", error);
    }
  };


  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`http://localhost:5001/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>


      <div className="padding_head">

        <div className="header">
          <div className="content">
            <div className="search_user">
              <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                <Button className="side_search_btn" variant="ghost" onClick={toggleModal}>
                  <i className="fas fa-search" style={{color:"white"}}></i>
                  <Text d={{ base: "none", md: "flex" }} px={4} color={"white"}>
                    Search User
                  </Text>
                </Button>
              </Tooltip>


              {/* <div className="App"> */}
              {/* <button onClick={toggleModal}>Open Modal</button>

            <div className={`modal ${showModal ? 'show' : ''}`}>
                <div className="modal-content">
                    <span className="close" onClick={toggleModal}>&times;</span>
                    <h2>Modal Title</h2>
                    <p>Modal Content Goes Here</p>
                </div>
            </div>
        </div> */}

              {showModal == true ? (
                <div className="modal  my_modal">
                  {/* Modal Content */}

                  <div className="modal-content ">
                    <div className="close" onClick={toggleModal}>&times;</div>

                    {/* Close button */}
                    {/* Modal Content Here */}

                    <Box display="flex" pb={2} >
                      <Input
                        placeholder="Search by name or email"
                        className="my_class"
                        mr={2}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <Button className="go_btn" style={{ marginBottom: "5x" }} onClick={handleSearch}>Go</Button>
                    </Box>
                    <div className="mycalendar" style={{ height: "856px" }}>

                      {searchResult.map((value, index) => {
                        return (
                          <Box key={index}
                            // onClick={handleFunction}
                            className=""
                            cursor="pointer"
                            bg="rgb(81 71 109)"
                            _hover={{
                              background: "#38B2AC",
                              color: "white",
                            }}
                            
                            w="100%"
                            display="flex"
                            alignItems="center"
                            color="white"
                            px={3}
                            py={2}
                            mb={2}
                            borderRadius="lg"
                            onClick={() => accessChat(value._id)}
                          >
                            <Avatar
                              mr={2}
                              size="sm"
                              cursor="pointer"
                              name={value.name}
                              src={value.pic}
                            />
                            <Box>
                              <Text>{value.name}</Text>
                              <Text fontSize="xs">
                                <b>Email : </b>
                                {value.email}
                              </Text>
                            </Box>


                          </Box>
                        )

                      })}
                    </div>

                    {loadingChat && <Spinner ml="auto" display="flex" />}


                  </div>




                </div>

              ) : ""}
            </div>
            <div>
              <Text fontSize="2xl" fontFamily="Work sans" fontStyle={"italic"}>
                Talk-A-Tive
              </Text>
            </div>
       
        
            <div className="my_flex">
            <Menu>
            <MenuButton p={1}>
              {/* <NotificationBadge */}
                {/* count={notification.length}
                effect={Effect.SCALE} */}
              {/* /> */}
              <div className="my_bell_icon" style={{display: notification.length == 0 ? "none" : "block"}}>
                <span>{notification.length}</span>
              </div>
              <BellIcon fontSize="2xl" m={1} style={{color:"white"}} /> 
            </MenuButton>

            <MenuList pl={2}                   className="my_list"
            >
              {!notification.length && <span style={{fontSize:"14px"}}>No New Messages</span>}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                  className="my_listt"
                  style={{  borderRadius:"5px"}}
                  
                >
                  <div  >
                    <span>New Messages:</span>
                  {notif.chat.isGroupChat
                    ? <span><span  > {notif.chat.chatName}</span></span>
                    : <span><span style={{ fontStyle:"italic",  borderRadius:"5px"}}> {getSender(user, notif.chat.users)}</span></span>}</div>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
              <Menu >
                <MenuButton as={Button} className="my_new_btn"  bg=" rgb(81 71 109)" rightIcon={<ChevronDownIcon style={{color:"white"}} />}>
                  <Avatar
                    size="sm"
                    cursor="pointer" 
                    name={user.name}
                    src={user.pic}
                  />
                </MenuButton>
                <MenuList bg=" rgb(81 71 109)" style={{padding:"10px", borderColor:"rgb(81 71 109)"}}>
                  <ProfileModal>
                    <MenuItem bg=" rgb(92 79 129) " style={{fontSize:"12px", borderRadius:"5px"}} onClick={openModal}>My Profile</MenuItem>{" "}</ProfileModal>
                  <MenuDivider />
                  <MenuItem bg="rgb(92 79 129) " style={{fontSize:"12px",  borderRadius:"5px"}} onClick={logouthandlesr}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </div>

          </div>
        </div>


      </div>



      {/* <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {/* <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2> */}
      {/* <button onClick={closeModal}>close</button>
        <div>I am a modal</div>
        <form>
          <input />
          <button>tab navigation</button>
          <button>stays</button>
          <button>inside</button>
          <button>the modal</button>

        </form> */}
      {/* </Modal> */}


    </>
  )
}

export default SideDrawer;