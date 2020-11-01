const docClient = require('../aws').getDocClient()
require('dotenv').config()

var params = {
  Key: { vars_hash: "f6b4c183db30bf8983238215c818c0aaf3101794", population: 100 },
  TableName: "covid_sim_graph_run_avg"
};

docClient.get(params, function (err, data) {
  if (err) {
    console.error('unable to get item: params: ', params, err)
  } else {
    console.log('data: ', data)
  }
})
