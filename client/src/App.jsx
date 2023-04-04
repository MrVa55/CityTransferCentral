import server from "./server";
import Transfer from "./Transfer";
import Login from "./Login";
import Sender from "./Sender";
import ClaimCity from "./ClaimCity";
import "./App.scss";
import { useState, useEffect } from "react";
import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { Box, Flex } from "@chakra-ui/react";


    


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
    console.log(privateKey)
     }, [privateKey]);

  useEffect(() => {
      async function loadCities() {
        const response = await server.get('cities');
        const loadedCities = response.data.cities;
        console.log(JSON.stringify(loadedCities));
        setCities(loadedCities);
      }
      loadCities();
  }, [address]);

  
  return (
    <ChakraProvider>
      <Box
        backgroundImage="/two_cities.png"
        backgroundRepeat="no-repeat"
        backgroundPosition="center center"
        backgroundSize="100vw 100vh"
        height="100vh"
       // margin="0"
      >
       
        {privateKey && city ? (
          <>
          <Flex direction="row" width="100%" height="100%"
          >
            <Box w="52%"
            backgroundImage={imageUrl}
             >
            <Flex justifyContent="center" alignItems="center" height="100%">
            <Sender
              balance={balance}
              setBalance={setBalance}
              address={address}
              privateKey={privateKey}
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
            <Box w="48%"
            backgroundImage={recipientImageUrl}>
            <Flex justifyContent="center" alignItems="center" height="100%">
            <Transfer
              setBalance={setBalance}
              address={address}
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
            balance={balance}
            setBalance={setBalance}
            address={address}
            privateKey={privateKey}
            setPrivateKey={setPrivateKey}
            setAddress={setAddress}
            name={name}
            setName={setName}
            city={city}
            setCity={setCity}
          />
           </Flex>
        ) : (
          <Flex justifyContent="center" alignItems="center" height="100%">
          <Login
            balance={balance}
            setBalance={setBalance}
            address={address}
            privateKey={privateKey}
            setPrivateKey={setPrivateKey}
            setAddress={setAddress}
            setName={setName}
            city={city}
            setCity={setCity}
            cities={cities}
          />
           </Flex>
        )}
     
      </Box>
    </ChakraProvider>
  );
  
  
}

export default App;
