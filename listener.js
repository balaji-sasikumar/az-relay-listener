const https = require("hyco-https");
const axios = require("axios");
const utils = require("util");
const ns = process.env.ns;
const path = process.env.path;
const keyrule = process.env.keyrule;
const key = process.env.key;

var uri = https.createRelayListenUri(ns, path);
var server = https.createRelayedServer(
  {
    server: uri,
    token: () => https.createRelayToken(uri, keyrule, key),
  },
  async (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      console.log(body);
      const response = await axios.post(
        "http://localhost:7071/api/queryTool",
        body
      );
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response.data));
    });
  }
);
server.listen();

server.on("error", (err) => {
  console.log(utils.inspect(err));
});
server.on("listening", () => {
  console.log("listening");
});
