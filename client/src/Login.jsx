import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import {toHex, utf8ToBytes} from "ethereum-cryptography/utils"
import { HDKey } from "ethereum-cryptography/hdkey";
import { useState, useEffect } from "react";
import { keccak256 } from "ethereum-cryptography/keccak";

function Login({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, name, setName, city, setCity, cities }) {
 
  

   // console.log(cities);

  const [seed, setSeed] = useState("");
  const [seed2, setSeed2] = useState("");
  
 
  
  

  
    
    async function generateKey(evt) {
        event.preventDefault();
        // const seed = evt.target.value;
      // setSeed(seed); 
      const hdkey1 = await HDKey.fromMasterSeed(keccak256(utf8ToBytes(seed, seed2, "a spoonfull of salt")));
    
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
    
  /*
    async function handleCityChange (evt) {
      const city = evt.target.value;
      setCity(city)
    }

    async function claimCity(evt) {
    console.log("Claim city")
    try {
    await server.post("claim-city", { city, address });
    } catch {console.log(error)}
    }
    /*
      async function onChange(evt) {
    
      const privateKey = evt.target.value;
      setPrivateKey(privateKey);
      const address = toHex(secp.getPublicKey(privateKey));
      setAddress(address)
      

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }

  }
*/

//  onChange={(e) => setSeed(e.target.value)}
  return (
    <div className="container wallet">
      <h1>Let's get started</h1>
      
      <form >
  <label>
    Pick a secret word. Shhhh!
    <input 
      placeholder="Pick something you can remember and don't tell it to anyone!" 
      value={seed} 
      onChange={(e) => setSeed(e.target.value)}
    />
     </label>

     <label>
    Pick another word (to make it harder to use a dictionary attack to guess your word)
    <input 
      placeholder="Pick something you can remember and don't tell it to anyone!" 
      value={seed2} 
      onChange={(e) => setSeed2(e.target.value)}
    />
     </label>

  <button type="submit" onClick={generateKey}>Let's go!</button>
</form>

{/*
      <label>
        What is your name?
        <input placeholder="What do you like to be called?" value={name} onChange={setName}></input>
      </label>

      
      <form onSubmit={claimCity}>
        <label>
        Pick a city where you will receive funds
        <input type="text" placeholder="Name of city" value={city} onChange={handleCityChange}/>
        </label>
        <button type="submit">Claim Your City</button>
      </form>
  
      
{/*
      <label>
        Private Key
        <input placeholder="Type in your private key" value={privateKey} onChange={onChange}></input>
      </label>
  */}  

      <div className="balance">Balance: {balance}</div>

      <div>Address: {address.slice(0,20)}..., city: {city}</div>


    </div>

    
  );
}

export default Login;
