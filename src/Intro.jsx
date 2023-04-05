
import { Heading, Card,Text } from "@chakra-ui/react"

function Intro() {
 
  return (
   
    <Card
    className="container wallet"
    bg="rgba(42, 165, 168, 0.7)"
    maxW = "500px"
    >
  
      <Heading size="md">Welcome to CityTransfer CENTRAL w/ ECDSA</Heading>
      
      <Text>
      CityTransfer CENTRAL is a week 1 project at Alchemy Univerisity. 
      </Text><br />
      <Text>
      The project demonstrates the use of public key cryptography through ECDSA (Elliptic Curve Digital Signature Algorithm).
      </Text>
      <Text>  <br />    
      In this project private keys are generated from 2 seed secret seed words and city names are used as public addresses allowing users to travel the globe.
      It securely identifies the sender of "gold coin" transactions without transferring the private key and protects against tampering and replay attacks. 
      </Text>
      <Text> <br />
      The team behind CityTransfer CENTRAL are aware that the number of cities in the world could be a bottleneck to adaptation, but as a school project such growth can not be anticipated in the near future.
      </Text>
      <Text><br />
        Instead, using cities as public addresses gives rise to a fun globetrotter game. Because all cities start with 100 gold coins and can only be claimed once, there is an incentive for users to claim new cities first and transfer the funds to their HQ.
        </Text><br />
      <Text>Try it out and have fun! </Text>
   

      
    </Card> 
  );
};

export default Intro;
