let redis = require('redis');
let config = require("./config");
var client = redis.createClient(config.port, config.host);
    client.auth("biraoti1,");
module.exports = client;