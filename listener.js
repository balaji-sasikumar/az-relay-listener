const https = require("hyco-https");
const axios = require("axios");

const ns = process.env.ns;
const path = process.env.path;
const keyrule = process.env.keyrule;
const key = process.env.key;

console.log(
  "namespace: " + ns,
  "path: " + path,
  "keyrule: " + keyrule,
  "key: " + key
);
var uri = https.createRelayListenUri(ns, path);
var server = https.createRelayedServer(
  {
    server: uri,
    token: () => https.createRelayToken(uri, keyrule, key),
  },
  async (req, res) => {
    const body = req.body;
    console.log("request received: " + req.method + " on " + req.url, body);
    const response = await axios.post(
      "http://localhost:7071/api/queryTool",
      body
    );
    console.log("request accepted: " + req.method + " on " + req.url);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(response.data));
  }
);
server.listen();

server.on("error", (err) => {
  console.log("error: " + JSON.stringify(err));
});
