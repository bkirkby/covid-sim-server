const AWS = require("aws-sdk");

var ddb = new AWS.DynamoDB({region: 'us-east-1'});
function getDocClient() {
  return new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
}

 exports.ddb = ddb;
 exports.getDocClient = getDocClient;