import axios from "axios";

const server = axios.create({
  baseURL: "https://citytransfer-server.herokuapp.com/",
});

export default server;
