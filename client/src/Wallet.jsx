import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import {toHex} from "ethereum-cryptography/utils"
import { useState } from "react";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
 const [seed, setSeed] = useState("");
 
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


  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      
      <label>
        Private Key
        <input placeholder="Type in your private key" value={privateKey} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>

      <div>Address: {address.slice(0,20)}...</div>

    </div>

    
  );
}

export default Wallet;
