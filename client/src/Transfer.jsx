import { useState, useEffect } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import {toHex} from "ethereum-cryptography/utils"
import  toUint8Array  from "ethereum-cryptography/utils";
import { Heading, Card, FormLabel, Button, Input, Box, Image } from "@chakra-ui/react"
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer,} from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter } from "@chakra-ui/react"



function Transfer({ address, setBalance, privateKey, cities, city, setRecipientImageUrl, recipientImageUrl, imageUrl,  }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientCity, setRecipientCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [transferConfirmed, setTransferConfirmed] = useState(false);
 

  const setValue = (setter) => (evt) => setter(evt.target.value);
  const setSearchQueryValue = (evt) => setSearchQuery(evt.target.value);
 
  function filterCities() {
    if (searchQuery) {
      return Object.keys(cities).filter((address) =>
        cities[address].city.toLowerCase().includes(searchQuery.toLowerCase()) || cities[address].name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      return Object.keys(cities);
    }
  }

  useEffect(() => {
    async function getImageUrl() {
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${recipientCity}&per_page=1&client_id=QLhAcZiALs_-hiAIsHUWhCQUaIq2k5Xu3zyGbutTkv8`);
      const data = await response.json();
      if (recipient && data.results.length > 0) {
        setRecipientImageUrl(data.results[0].urls.regular);
      } else {
        setRecipientImageUrl(null);
      }
    }
    getImageUrl();
    
   }, [recipient]);

   

   async function newRecipient(recipient, city) {
    await setRecipientCity(city);
    await setRecipient(recipient);
    await setTransferConfirmed(false);
    
   }

  async function transfer(evt) {
    evt.preventDefault();
    

  const transaction = {
      amount: parseInt(sendAmount),
      recipient,
    }
    transaction.message = 
    transaction.hash = toHex(keccak256(utf8ToBytes(JSON.stringify(transaction))))
    const signature = await secp.sign( transaction.hash , privateKey, {recovered: true });
    const [sig, recovery] = signature;
    transaction.signature = toHex(sig);
    transaction.recovery = recovery;
    

    try {
      const {
        data: { balance },
      } = await server.post(`send`, transaction);
      setBalance(balance);
      
      setTransferConfirmed(true);
    } catch (ex) {
      alert(ex.response.data.message);
    }

    
  }

  function toggleModal() {
    setShowModal(!showModal);
  }

  if (recipient){
  return (
    <Card
    className="container wallet"
    bg="rgba(42, 165, 168, 0.7)"
    maxW = "500px"
    
  >
    
      
        <Heading size="md">Sending to {recipientCity}   <Button onClick={() => newRecipient(null, null)}>Change recipient</Button></Heading>
      
        <FormLabel> 
          How many gold coins will you send?
          <Input
            placeholder="1, 2, 3..."
            value={sendAmount}
            onChange={setValue(setSendAmount)}
          ></Input>
         </FormLabel>
  
      {/*
        <label>
          Recipient
          <input
            placeholder="Type an address, for example: 0x2"
            value={recipient}
            onChange={setValue(setRecipient)}
          ></input>
          </label>
       */}

        
        <form onSubmit={(evt) => { evt.preventDefault(); toggleModal(); }}>
       <input type="submit" className="button" value="Transfer" />
     

       {showModal && (
  <Modal isOpen={showModal} onClose={toggleModal}>
    <ModalOverlay />
    <ModalContent>
      {!transferConfirmed ? (
        <>
          <ModalHeader>Confirm transfer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" flexDirection="row">
              <Image src={imageUrl} width="30%" />
              <Image src="/arrow.png" width="30%" />
              <Image src={recipientImageUrl} width="30%" />
            </Box>
            <p>
              You are transferring {sendAmount} gold coins from {city} to{" "}
              {recipientCity}. Confirm?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={transfer}>Confirm</Button>
            <Button onClick={toggleModal}>Cancel</Button>
          </ModalFooter>
        </>
      ) : (
        <>
          <ModalHeader>Transaction complete!</ModalHeader>
          <ModalBody>
            <Box display="flex" flexDirection="row">
              <video
                autoPlay
                muted
                style={{ width: "100%", maxWidth: "400px" }}
              >
                <source src="../public/animation.webm" type="video/webm" />
              </video>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => newRecipient(null, null)}>Great!</Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
)}


         </form>
         
        </Card>
  );
  } else { 

    return (
     
      <Card
      className="container wallet"
      bg="rgba(42, 165, 168, 0.7)"
      maxW = "500px"
      
    >
       <Heading size="md">Transfer gold coins </Heading>
        <label>
          Search by city or name:
          <input
            type="text"
            value={searchQuery}
            onChange={setSearchQueryValue}
          />
        </label>
      
      <TableContainer 
      height="50vh" // set a maximum height
      overflowY="auto"> 
      <Table size="Sm">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>City</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filterCities().map((address) => {
            const { city, name } = cities[address];
            return (
              <Tr key={address}>
                <Td>{name}</Td>
                <Td>{city}</Td>
                <Td>
                  <Button size="sm" value={address} onClick={() => newRecipient(address, city)}>
                    Send here
                  </Button>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      </TableContainer>
      </Card>
  );
  }        
}

export default Transfer;
