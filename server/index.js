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

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
 
  const { signature, recovery, hash, recipient, amount } = req.body;
  const pubKey = secp.recoverPublicKey(hash, signature, recovery);
  const sender = toHex(pubKey) 

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
  const cityAlreadyClaimed = Object.values(cities).find(c => c.city.toLowercase === city.toLowercase);
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
