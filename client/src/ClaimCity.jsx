import server from "./server";
import { useState, useEffect } from "react";
import { Heading, Card, Box, Button, FormControl, FormLabel, FormErrorMessage, Input } from "@chakra-ui/react"

function ClaimCity({ address, name, setName, setCity }) {
  const [newCity, setNewCity] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  

  async function claimCity(evt) {
    evt.preventDefault();
   
  try {
    await server.post("claim-city", { newCity, address, name });
    setCity(newCity)
    setErrorMsg("");
    } catch (error) {
      if (error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg(error.message);
      }
    }
  }
  
  async function handleNameChange (evt) {
    const name = evt.target.value;
    setName(name)
  }

  async function handleCityChange (evt) {
    const newCity = evt.target.value;
    setNewCity(newCity)
  }
  
  return (
    <Card className="container wallet" bg="rgba(42, 165, 168, 0.7)" maxW="500px">
      <Heading>Where do you want your address?</Heading>
      <h4>CityTransfer Central-ECDSA uses a city as your public address. Pick one. </h4>
      <FormLabel>
        What is your name?
        <Input placeholder="What do you like to be called?" value={name} onChange={handleNameChange} />
        </FormLabel>
      <FormControl isInvalid={errorMsg}>
        <form onSubmit={claimCity}>
        <FormLabel>
          Pick a city where you will receive funds
          <Input type="text" placeholder="Name of City" value={newCity} onChange={handleCityChange} />
          </FormLabel>
        {errorMsg ? (
          <Box p="1">
            <FormErrorMessage>{errorMsg}</FormErrorMessage>
          </Box>
        ) : null}
        <Button type="submit">Claim Your City</Button>
      </form>
      </FormControl>
    </Card>
  );
  
}

export default ClaimCity;
