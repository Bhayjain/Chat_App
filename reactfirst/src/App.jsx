import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Registrationform from './components/authentication/Registrationform';
import ChatPage from './Pages/ChatPage';
import ChatProvider from './Context/ChatProvider';
// import Loginform from './components/authentication/login';
import { ChakraProvider } from "@chakra-ui/react";
import Home from './home';
import Homepage from './Pages/Homepage';

function App() {
  return (
    <ChakraProvider>
      <ChatProvider>
        <Routes>
          <Route path="/register" element={<Registrationform />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Homepage />} />
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/" element={<Homepage />} />
        </Routes>
      </ChatProvider>
    </ChakraProvider>
  );
}

export default App;
