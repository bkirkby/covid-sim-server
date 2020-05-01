const sha1 = require("sha1");
const getDocClient = require("./aws").getDocClient;

function hashGraph({isolation,population,social_distance}) {
  return sha1(JSON.stringify({isolation,population,social_distance}))
}

async function addGraphToAvg({
  isolation,
  social_distance,
  population,
  dead_array: add_dead_array=[],
  immune_array: add_immune_array=[],
  healthy_array: add_healthy_array=[],
  infected_array: add_infected_array=[]})
{
  let avgGraph = await getAvgGraph({isolation, social_distance, population})
  // console.log('bk: graphService.js: addGraphToAvg: avgGraph: ', avgGraph)

  avgGraph = {
    ...avgGraph,
    total_runs: avgGraph.total_runs + 1
  }

  // healthy_array
  const larger_healthy_array = avgGraph.healthy_array.length > add_healthy_array.length ? avgGraph.healthy_array : add_healthy_array
  const smaller_healthy_array = avgGraph.healthy_array.length <= add_healthy_array.length ? avgGraph.healthy_array : add_healthy_array

  // immune_array
  const larger_immune_array = avgGraph.immune_array.length > add_immune_array.length ? avgGraph.immune_array : add_immune_array
  const smaller_immune_array = avgGraph.immune_array.length <= add_immune_array.length ? avgGraph.immune_array : add_immune_array

  // infected_array
  const larger_infected_array = avgGraph.infected_array.length > add_infected_array.length ? avgGraph.infected_array : add_infected_array
  const smaller_infected_array = avgGraph.infected_array.length <= add_infected_array.length ? avgGraph.infected_array : add_infected_array

  // dead_array
  const larger_dead_array = avgGraph.dead_array.length > add_dead_array.length ? avgGraph.dead_array : add_dead_array
  const smaller_dead_array = avgGraph.dead_array.length <= add_dead_array.length ? avgGraph.dead_array : add_dead_array

  avgGraph = {
    ...avgGraph,
    healthy_array: larger_healthy_array.map((metric,idx) => {
      if (smaller_healthy_array[idx] === undefined) {
        return metric
      } else {
        return metric + smaller_healthy_array[idx]
      }
    }),
    immune_array: larger_immune_array.map((metric,idx) => {
      if (smaller_immune_array[idx] === undefined) {
        return metric
      } else {
        return metric + smaller_immune_array[idx]
      }
    }),
    infected_array: larger_infected_array.map((metric,idx) => {
      if (smaller_infected_array[idx] === undefined) {
        return metric
      } else {
        return metric + smaller_infected_array[idx]
      }
    }),
    dead_array: larger_dead_array.map((metric,idx) => {
      if (smaller_dead_array[idx] === undefined) {
        return metric
      } else {
        return metric + smaller_dead_array[idx]
      }
    })
  }

  // save to database
  return avgGraph
}

function putAvgGraph({
  isolation,
  social_distance,
  population,
  dead_array,
  immune_array,
  healthy_array,
  infected_array})
{
  const vars_hash = hashGraph({isolation, social_distance, population})
  const params = {
    Item: {
      vars_hash,
      isolation,
      social_distance,
      population,
      dead_array,
      immune_array,
      healthy_array,
      infected_array
    },
    TableName: "covid_sim_graph_run_avg"
  }

  return new Promise(function(resolve, reject) {
    getDocClient().put(params, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

function getAvgGraph({isolation, social_distance, population}) {
  const vars_hash = hashGraph({isolation, social_distance, population})
  const params = {
    Key: {vars_hash},
    TableName: "covid_sim_graph_run_avg"
  }

  return new Promise(function(resolve,reject) {
    getDocClient().get(params, function(err, data) {
      if (err) {
        // console.log('bk: graphService.js: getAvgGraph: ddb.getItem: err: ', err)
        reject(err)
      } else {
        // console.log('bk: graphService.js: getAvgGraph: ddb.getItem: data: ', data)
        resolve(data.Item)
      }
    })
  })
}

exports.getAvgGraph = getAvgGraph;
exports.putAvgGraph = putAvgGraph;
exports.addGraphToAvg = addGraphToAvg;
exports.hashGraph = hashGraph;