const https = require("hyco-https");
const axios = require("axios");
const utils = require("util");

const ns = process.env.ns;
const keyrule1 = process.env.keyrule1;
const path1 = process.env.path1;
const key1 = process.env.key1;
const keyrule2 = process.env.keyrule2;
const path2 = process.env.path2;
const key2 = process.env.key2;

const createListener = (requestUrl, keyrule, path, key) => {
  var uri = https.createRelayListenUri(ns, path);
  return https.createRelayedServer(
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
        try {
          const response = await axios.post(requestUrl, body);
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(response.data));
        } catch (error) {
          console.error("Error handling request:", error);
          res.statusCode = 500;
          res.end(JSON.stringify({ message: "Internal Server Error" }));
        }
      });
    }
  );
};

var server1 = createListener(
  "http://localhost:7071/api/queryTool",
  keyrule1,
  path1,
  key1
);
var server2 = createListener(
  "http://localhost:7072/api/sumavision-http-trigger",
  keyrule2,
  path2,
  key2
);
server1.listen();
server2.listen();

server1.on("error", (err) => {
  console.log(utils.inspect(err));
});
server1.on("listening", () => {
  console.log("server1 listening");
});
server2.on("error", (err) => {
  console.log(utils.inspect(err));
});
server2.on("listening", () => {
  console.log("server2 listening");
});
