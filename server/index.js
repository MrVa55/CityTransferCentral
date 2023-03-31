const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { toHex } = require("ethereum-cryptography/utils");

const secp = require("ethereum-cryptography/secp256k1");
// const { utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
  "0x666": 666,
  "04c45069ab75e116d5715fd91d6aa0f6de4cbc12783d36b0927cc81b0b246aa9146f0a7bfb8db771f732342c483201ca52ce8651ba23f704625642ad429ea940d2": 100,
  "044698c76fc15f11667338f1b6559df7ad7c5596fd7c755eacbb94ab82ccfef97528e7809bd73a2e0413085b7780e4e3c5c7ee0c30e1e839372d921acb84127122": 100,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
 
  const { signature, recovery, hash, recipient, amount } = req.body;
  const pubKey = secp.recoverPublicKey(hash, signature, recovery);
  console.log("Public key is" , pubKey)
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

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
