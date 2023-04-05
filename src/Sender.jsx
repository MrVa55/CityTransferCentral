import server from "./server";
import { useState, useEffect } from "react";
import { Heading, Card, Flex, Box, Image, FormLabel, Button, Input } from "@chakra-ui/react"

function Sender({ address, setAddress, balance, setBalance, setPrivateKey, name, setName, city, setCity, setImageUrl }) {


  useEffect(() => {
   async function getBalances() {
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
    setBalance(balance);
    } else {
    setBalance(0);
    }
    }
  getBalances();
  }, []);

  useEffect(() => {
    async function getImageUrl() {
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${city}&per_page=1&client_id=QLhAcZiALs_-hiAIsHUWhCQUaIq2k5Xu3zyGbutTkv8`);
      const data = await response.json();
      if (data.results.length > 0) {
        setImageUrl(data.results[0].urls.regular);
      } else {
        setImageUrl(null);
      }
    }
    getImageUrl();
    
  }, []);

  function logOut () {
    setPrivateKey("");
    setAddress("");
    setName("");
    setCity("");
  } 
  
  return (
    <Card
    className="container wallet"
    bg="rgba(42, 165, 168, 0.7)"
    maxW = "500px"
    >  
      <Heading size="lg">Hello {name}, Welcome to {city}!</Heading>
    
      <Card 
      p="3"
      m="3"
      bg="rgba(37, 104, 128, 0.7)">
      
        <Heading size="sm">Coffers of {city} contain:</Heading>
        <Flex alignItems="center" direction="row">
          <Image maxW="150px" src="/coffer.png" />
          <Box ml={4} color="gold" fontWeight="bold">{balance} gold coins</Box>
        </Flex>
      
      </Card>
      <Button onClick={logOut}>Leave {city}</Button>
   
    </Card>
    
  );
}

export default Sender;
