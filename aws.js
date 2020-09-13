const AWS = require("aws-sdk");
const config = require('./configService').getConfig()

function getDocClient() {
  return new AWS.DynamoDB.DocumentClient(config.AWS_CONFIG);
}

 exports.getDocClient = getDocClient;