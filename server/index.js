const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { toHex } = require("ethereum-cryptography/utils");

const validCity = require("./validCity.js");

const secp = require("ethereum-cryptography/secp256k1");


app.use(cors());
app.use(express.json());


const balances = {};
const cities = {};
const timestamps = {};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
 
  const { signature, recovery, hash, recipient, amount, timestamp } = req.body;
  const pubKey = secp.recoverPublicKey(hash, signature, recovery);
  const sender = toHex(pubKey) 

  // Check if timestamp is within last 2 minutes
  if (timestamp - Date.now() > 2 * 60 * 1000) {
    return res.status(400).send({ message: "Transaction expired. Time limit 2 minutes" });
  }
  
  // check for replay
  if (timestamps[sender]) {
    const index = timestamps[sender].indexOf(timestamp);
    if (index !== -1) {
      return res.status(400).send({ message: "Transaction already went through. Create new transaction" });
    } else {
  
    // add timestamp to recent timestamps
    timestamps[sender].push(timestamp);
    }
  } else {
  timestamps[sender] =  [ timestamp ];
  }
  console.log(timestamps)

  // delete timestamp after 2 minutes
  function deleteTimestamp(address, timestamp) {
    if (timestamps[address]) {
      const index = timestamps[address].indexOf(timestamp);
      if (index !== -1) {
        timestamps[address].splice(index, 1);
      }
    }
  }
  setTimeout(() => deleteTimestamp(sender, timestamp), 120000)



  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});


app.post("/claim-city", async (req, res) => {
  const { newCity: city, address, name } = req.body;
  if (cities[address]) {
    return res.status(400).send({ message: "You have already claimed a city" });
  }
  const cityAlreadyClaimed = Object.values(cities).find(c => c.city.toLowerCase() === city.toLowerCase());
  const cityIsValid = await validCity(city);
  if (cityAlreadyClaimed) {
    return res.status(400).send({ message: "City already claimed" });
  }
 if (!cityIsValid) {
    return res.status(400).send({ message: "That's not a city! Please pick a real place" });
  }
  else {
  cities[address] = { city, name };
  res.send({ message: "City claimed successfully" });
  console.log(`${city} was claimed by ${name} at address ${address}. This is cities now:`, cities);

  balances[address] = 100;
  }
});


app.get("/cities", (req, res) => {
  res.send({ cities });
});


app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
