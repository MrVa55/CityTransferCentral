import server from "./server";
import Transfer from "./Transfer";
import Intro from "./Intro";
import Login from "./Login";
import Sender from "./Sender";
import ClaimCity from "./ClaimCity";
import "./App.scss";
import * as React from 'react'
import { useState, useEffect } from "react";
import { ChakraProvider } from '@chakra-ui/react'
import { Box, Flex } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react"


// Define custom theme
const customTheme = extendTheme({
  components: {
    Text: {
      baseStyle: {
        color: "white",
        fontSize: "sm",
      },},
    Heading: {
      baseStyle: {
        color: "white",
      }
    },
    FormLabel: {
      baseStyle: {
        color: "white",
      }
    },
  },
 })
  


function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [cities, setCities] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [recipientImageUrl, setRecipientImageUrl] = useState(null);

 useEffect(() => {
      async function loadCities() {
        const response = await server.get('cities');
        const loadedCities = response.data.cities;
        setCities(loadedCities);
      }
      loadCities();
  }, [address]);

  
  return (
    <ChakraProvider theme={customTheme}>
     <Box   bg="rgba(58, 42, 58)" minHeight="auto">
      <Box
        backgroundImage="/two_cities.png"
        backgroundRepeat="no-repeat"
        backgroundPosition="center center"
        backgroundSize="100vw 100vh"
        height="100vh"
      >
       
        {privateKey && city ? (
          <>
          <Flex direction={{ base: "column", md: "row" }} width="100%" height="100%">
            <Box w={{ base: '100%', md: '52%' }} backgroundImage={imageUrl} backgroundSize="cover">
            
            <Flex justifyContent="center" alignItems="center" height="100%">
            <Sender
              balance={balance}
              setBalance={setBalance}
              address={address}
              setPrivateKey={setPrivateKey}
              setAddress={setAddress}
              name={name}
              setName={setName}
              city={city}
              setCity={setCity}
              setImageUrl={setImageUrl}
              
            />
            </Flex>
            </Box>
            <Box w={{ base: '100%', md: '48%' }} backgroundImage={recipientImageUrl} backgroundSize="cover">
            <Flex justifyContent="center" alignItems="center" height="100%">
            <Transfer
              setBalance={setBalance}
              privateKey={privateKey}
              cities={cities}
              city={city}
              setRecipientImageUrl={setRecipientImageUrl}
              imageUrl={imageUrl}
              recipientImageUrl={recipientImageUrl}
            />
           </Flex>
            </Box>
            </Flex>
          </>
        
        ) : privateKey ? (
          <Flex justifyContent="center" alignItems="center" height="100%">
          <ClaimCity
            address={address}
            name={name}
            setName={setName}
            setCity={setCity}
          />
           </Flex>
        ) : (
          <Flex direction={{ base: "column", md: "row" }} width="100%" height="100%">
     
          <Intro />
          <Login
            setBalance={setBalance}
            setPrivateKey={setPrivateKey}
            setAddress={setAddress}
            setName={setName}
            setCity={setCity}
            cities={cities}
          />
           </Flex>
        )}
     
      </Box>
      </Box>
    </ChakraProvider>
  );
  
  
}

export default App;
