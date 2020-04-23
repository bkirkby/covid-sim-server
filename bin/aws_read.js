const AWS = require("aws-sdk");

//const config = new AWS.Config({region: "us-east-1"});
//const dynamoDb = new AWS.DynamoDB(config);
const dynamoDb = new AWS.DynamoDB();

var params = {
  Key: {
    "vars_hash": {"S":"6abb2a57329263b3a328a0b95bda5bd504dec62a"}
  },
  TableName: "covid_sim_graph_run_avg"
};

dynamoDb.getItem(params, function(err,data) {
  if (err) {
    console.log('err: ', err);
    return;
  }
  console.log('data: ', data);
});