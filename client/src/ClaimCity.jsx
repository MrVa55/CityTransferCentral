import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import {toHex, utf8ToBytes} from "ethereum-cryptography/utils"
import { HDKey } from "ethereum-cryptography/hdkey";
import { useState, useEffect } from "react";
import { keccak256 } from "ethereum-cryptography/keccak";

function ClaimCity({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, name, setName, city, setCity }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [newCity, setNewCity] = useState("");
  

  async function handleNameChange (evt) {
    const name = evt.target.value;
    setName(name)
  }

  async function handleCityChange (evt) {
    const newCity = evt.target.value;
    setNewCity(newCity)
  }
 
  async function claimCity(evt) {
    event.preventDefault();
    //console.log("Claim city by ", name)
    //console.log("New City:", newCity, "City: ", city)
  try {
    await server.post("claim-city", { newCity, address, name });
    } catch (error){console.log(error)}
    setCity(newCity);
  }

   
  return (
   
 <div className="container wallet">
 <h1>Where do you want your address?</h1>

 <h4>CityTransfer Central-ECDSA uses a city as your public address. Pick one. 
 </h4>
 
 <label>
   What is your name?
   <input placeholder="What do you like to be called?" value={name} onChange={handleNameChange}></input>
 </label>

 
 <form onSubmit={claimCity}>
   <label>
   Pick a city where you will receive funds
   <input type="text" placeholder="Name of City" value={newCity} onChange={handleCityChange}/>
   </label>
   <button type="submit">Claim Your City</button>
 </form>


        
     


    </div>

    
  );
}

export default ClaimCity;
