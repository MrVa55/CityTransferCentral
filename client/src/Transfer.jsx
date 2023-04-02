import { useState, useEffect } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import {toHex} from "ethereum-cryptography/utils"
import  toUint8Array  from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKey, cities }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientCity, setRecipientCity] = useState("");
  const [recipientImageUrl, setRecipientImageUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const setValue = (setter) => (evt) => setter(evt.target.value);
 
  useEffect(() => {
    async function getImageUrl() {
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${recipientCity}&per_page=1&client_id=QLhAcZiALs_-hiAIsHUWhCQUaIq2k5Xu3zyGbutTkv8`);
      const data = await response.json();
      if (data.results.length > 0) {
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

      setTimeout(() => {
        alert("Transfer completed");
      }, 3000);
      
      setShowModal(!showModal);
    } catch (ex) {
      alert(ex.response.data.message);
    }

    
  }

  function toggleModal() {
    setShowModal(!showModal);
  }

  return (
    <div>
      <form className="container transfer" onSubmit={(evt) => { evt.preventDefault(); toggleModal(); }}>
        <h1>Send Transaction</h1>
        {recipientImageUrl && <img src={recipientImageUrl} height="400px" />}
        <label>
          Send Amount
          <input
            placeholder="1, 2, 3..."
            value={sendAmount}
            onChange={setValue(setSendAmount)}
          ></input>
        </label>
  
        <label>
          Recipient
          <input
            placeholder="Type an address, for example: 0x2"
            value={recipient}
            onChange={setValue(setRecipient)}
          ></input>
        </label>
  
        <input type="submit" className="button" value="Transfer" />
  
        {showModal && (
          <div className="modal">
            <div className="modal-content">
            <video autoPlay loop muted style={{ width: "100%", maxWidth: "400px" }}>
            <source src="../public/animation.webm" type="video/webm" />
            </video>
              <p>
                You are transferring {sendAmount} from your account to {recipient} in{" "}
                {recipientCity}. Confirm?
              </p>
              <button onClick={transfer}>Confirm</button>
              <button onClick={toggleModal}>Cancel</button>
            </div>
          </div>
        )}
      </form>
  
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(cities).map((address) => {
            const { city, name } = cities[address];
            return (
              <tr key={address}>
                <td>{name}</td>
                <td>{city}</td>
                <td>
                  <button value={address} onClick={() => newRecipient(address, city)}>
                    Send here
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
  
}

export default Transfer;
