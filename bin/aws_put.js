const docClient = require('../aws').getDocClient()
//const config = new AWS.Config({region: "us-east-1"});
//const dynamoDb = new AWS.DynamoDB(config);

var params = {
  Item: {
    vars_hash: "bogus_item_for_test_purposes",
    isolation: .1,
    social_distance: 0.5,
    population: 100,
    dead_array: [],
    immune_array: [],
    healthy_array: [],
    infected_array: [],
    total_runs: 1
  },
  TableName: "covid_sim_graph_run_avg"
};

docClient.put(params, function(err, data) {
  if (err) {
    console.error('unable to get item: params: ', params, err)
  } else {
    console.log('data: ', data)
  }
})
