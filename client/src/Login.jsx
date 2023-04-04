import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import {toHex, utf8ToBytes} from "ethereum-cryptography/utils"
import { HDKey } from "ethereum-cryptography/hdkey";
import { useState, useEffect } from "react";
import { keccak256 } from "ethereum-cryptography/keccak";
import { Heading, Card, FormLabel, Button, Input } from "@chakra-ui/react"

function Login({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, name, setName, city, setCity, cities }) {
 
  

   // console.log(cities);

  const [seed, setSeed] = useState("");
  const [seed2, setSeed2] = useState("");
  
 
  
  

  
    
    async function generateKey(evt) {
        event.preventDefault();
        // const seed = evt.target.value;
      // setSeed(seed);
      const fullseed=seed+seed2+"a spoonfull of salt"
      console.log(seed, seed2)
      const hdkey1 = await HDKey.fromMasterSeed(keccak256(utf8ToBytes(fullseed)));
    
       // console.log(hdkey1)

       const privateKey = hdkey1.privKeyBytes;
       setPrivateKey(privateKey);
       const address = toHex(secp.getPublicKey(privateKey));
       setAddress(address)
       
 
        if (address) {
            const {
                data: { balance },
            } = await server.get(`balance/${address}`);
            setBalance(balance);
            
            console.log ("Cities: ", cities)
  
                       
            if (address in cities) {
                  const { city , name } = cities[address];
                  console.log("Hi ",{name}, ", You live in", city);
                  setCity(city);
                  setName(name);
                } else {
                  console.log("No city found for this address");
                }

        }   else {
            setBalance(0);
            // setCity("")
       
         
        }    
    }
  // <div className="container wallet">  
  return (
   
    <Card
    className="container wallet"
    bg="rgba(42, 165, 168, 0.7)"
    maxW = "500px"
    
  >
  
      <Heading size="lg">Let's get started</Heading>
      
      <form >
      <FormLabel>
    Pick a secret word. Shhhh!
    <Input 
      placeholder="Pick something you can remember and don't tell it to anyone!" 
      value={seed} 
      onChange={(e) => setSeed(e.target.value)}
    />
      </FormLabel>

      <FormLabel>
    Pick another word (to make it harder to use a dictionary attack to guess your word)
    <Input 
      placeholder="Pick something you can remember and don't tell it to anyone!" 
      value={seed2} 
      onChange={(e) => setSeed2(e.target.value)}
    />
      </FormLabel>

  <Button type="submit" onClick={generateKey}>Let's go!</Button>
  </form>
  </Card>
 



    
  );
}

export default Login;
