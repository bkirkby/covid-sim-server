const sha1 = require("sha1");
const ddb = require("./aws").ddb;

function getAvgGraph({isolation, social_distance, population}) {
  const vars_hash = sha1(JSON.stringify({isolation,population,social_distance}))

  const params = {
    Key: {
      vars_hash: {S:vars_hash}
    },
    TableName: "covid_sim_graph_run_avg"
  }

  // console.log('bk: graphService.js: getAvgGraph: vars_hash: ', vars_hash)
  // console.log('bk: graphService.js: getAvgGraph: params: ', params)
  return new Promise(function(resolve,reject) {
    ddb.getItem(params, function(err, data) {
      if (err) {
        // console.log('bk: graphService.js: getAvgGraph: ddb.getItem: err: ', err)
        reject(err)
      } else {
        // console.log('bk: graphService.js: getAvgGraph: ddb.getItem: data: ', data)
        resolve(data)
      }
    })
  })
}

exports.getAvgGraph = getAvgGraph;