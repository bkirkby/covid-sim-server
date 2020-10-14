const sha1 = require("sha1");
const logger = require('./logger');
const getDocClient = require("./aws").getDocClient;

function hashGraph({isolation,population,social_distance}) {
  return sha1(JSON.stringify({isolation,population,social_distance}))
}

async function addGraphToAvg({
  isolation,
  social_distance,
  population,
  dead_array,
  immune_array,
  healthy_array,
  infected_array
})
{
  let avgGraph = await getAvgGraph({isolation, social_distance, population})

  // logger.debug('addGraphToAvg: result of getAvgGraph: avgGraph: ', avgGraph)
  console.log('addGraphToAvg: result of getAvgGraph: avgGraph: ', avgGraph)

  avgGraph = {
    ...avgGraph,
    total_runs: avgGraph.total_runs + 1
  }

  // healthy_array
  const larger_healthy_array = avgGraph.healthy_array.length > healthy_array.length ? avgGraph.healthy_array : healthy_array
  const smaller_healthy_array = avgGraph.healthy_array.length <= healthy_array.length ? avgGraph.healthy_array : healthy_array

  // immune_array
  const larger_immune_array = avgGraph.immune_array.length > immune_array.length ? avgGraph.immune_array : immune_array
  const smaller_immune_array = avgGraph.immune_array.length <= immune_array.length ? avgGraph.immune_array : immune_array

  // infected_array
  const larger_infected_array = avgGraph.infected_array.length > infected_array.length ? avgGraph.infected_array : infected_array
  const smaller_infected_array = avgGraph.infected_array.length <= infected_array.length ? avgGraph.infected_array : infected_array

  // dead_array
  const larger_dead_array = avgGraph.dead_array.length > dead_array.length ? avgGraph.dead_array : dead_array
  const smaller_dead_array = avgGraph.dead_array.length <= dead_array.length ? avgGraph.dead_array : dead_array

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
  return await putAvgGraph(avgGraph)
}

function putAvgGraph({
  isolation,
  social_distance,
  population,
  dead_array,
  immune_array,
  healthy_array,
  infected_array,
  total_runs})
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
      infected_array,
      total_runs
    },
    TableName: "covid_sim_graph_run_avg"
  }

  return new Promise(function(resolve, reject) {
    getDocClient().put(params, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(params.Item)
      }
    })
  })
}

function getGraphList() {
  const params = {
    TableName: "covid_sim_graph_run_avg"
  }

  return new Promise(function(resolve,reject) {
    getDocClient().scan(params, function(err, data) {
      if (err) {
        logger.error('unable to scan table');
        reject(`unable to scan table: ${err}`);
      } else {
        console.log('bk: graphService.js: getAvgGraph: ddb.scan: data: ', data);
        const ret_items = data.Items.map(item => {
          return {
            isolation: item.isolation,
            population: item.population,
            social_distance: item.social_distance
          }
        })
        resolve(ret_items);
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
        logger.error('unable to get avgGraph for isolation, social_distance, population: ',
          isolation, social_distance, population);
        reject(err)
      } else {
        console.log('bk: graphService.js: getAvgGraph: ddb.getItem: data: ', data)
        let item = data.Item;
        if (!item) {
          item = {
            vars_hash,
            total_runs: 0,
            population,
            social_distance,
            isolation,
            immune_array: [],
            dead_array: [],
            healthy_array: [],
            infected_array: []
          }
        }
        resolve(item)
      }
    })
  })
}

exports.getAvgGraph = getAvgGraph;
exports.putAvgGraph = putAvgGraph;
exports.addGraphToAvg = addGraphToAvg;
exports.hashGraph = hashGraph;
exports.getGraphList = getGraphList;