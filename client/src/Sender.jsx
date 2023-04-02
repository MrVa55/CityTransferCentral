import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import {toHex, utf8ToBytes} from "ethereum-cryptography/utils"
import { HDKey } from "ethereum-cryptography/hdkey";
import { useState, useEffect } from "react";
import { keccak256 } from "ethereum-cryptography/keccak";

function Sender({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, name, setName, city, setCity }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [newCity, setNewCity] = useState(null);

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
  
/*
   

 

  */
  
  return (
    <div className="container wallet">
  
   
    <h1>Hello {name}, Welcome to {city}!</h1>
    {imageUrl && <img src={imageUrl} alt={city} height="400px" />}

    <div className="balance">Balance: {balance}</div>

    <div>Address: {address.slice(0,20)}...</div>

    <button onClick={logOut}>Log out</button>
    </div>

    
  );
}

export default Sender;
