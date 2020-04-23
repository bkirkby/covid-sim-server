const AWS = require("aws-sdk");

 var ddb = new AWS.DynamoDB({region: 'us-east-1'});

 exports.ddb = ddb;