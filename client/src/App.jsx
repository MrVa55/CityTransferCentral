import server from "./server";
import Transfer from "./Transfer";
import Login from "./Login";
import Sender from "./Sender";
import ClaimCity from "./ClaimCity";
import "./App.scss";
import { useState, useEffect } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [cities, setCities] = useState(null);

  useEffect(() => {
    console.log(privateKey)
     }, [privateKey]);

  useEffect(() => {
      async function loadCities() {
        const response = await server.get('cities');
        const loadedCities = response.data.cities;
        console.log(JSON.stringify(loadedCities));
        setCities(loadedCities);
      }
      loadCities();
  }, [address]);

  if(privateKey && city){
  return (
    <div className="app">
      <Sender
        balance={balance}
        setBalance={setBalance}
        address={address}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        setAddress={setAddress}
        name = {name}
        setName={setName}
        city={city}
        setCity={setCity}
      />
      
      <Transfer setBalance={setBalance} address={address} privateKey={privateKey} cities={cities}/>
    </div>
  )} else if( privateKey && !city){
    return (
      <div className="app">
        <ClaimCity
          balance={balance}
          setBalance={setBalance}
          address={address}
          privateKey={privateKey}
          setPrivateKey={setPrivateKey}
          setAddress={setAddress}
          name = {name}
          setName={setName}
          city={city}
          setCity={setCity}
        />
        
       
      </div>
    )} else {
    return (
      <div className="app">
        <Login
          balance={balance}
          setBalance={setBalance}
          address={address}
          privateKey={privateKey}
          setPrivateKey={setPrivateKey}
          setAddress={setAddress}
          setName={setName}
          city={city}
          setCity={setCity}
          cities={cities}
        />
      </div>
  )
}
}
export default App;
