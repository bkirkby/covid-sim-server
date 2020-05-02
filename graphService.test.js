const AWS = require('aws-sdk')
const AWSMock = require('aws-sdk-mock')
const graphService = require("./graphService")

test('hashGraph properly hashes', function() {
  const expected = "4741eb9abc7c4e824f1e0ed7e40ef632e286d977";
  const actual = graphService.hashGraph({isolation:0, population:0, social_distance:0});
  expect(actual).toBe(expected);
})

test('addGraphToAvg adds a graph to average, new array is larger', async function() {
  const graphParams = {isolation:0, social_distance:0, population:0}
  const graphHash = "4741eb9abc7c4e824f1e0ed7e40ef632e286d977";
  const new_healthy_array = [99,98,97,97,96]
  const new_dead_array = [0,0,0,0,0]
  const new_immune_array = [0,0,0,0,2]
  const new_infected_array = [1,2,3,3,2]
  AWSMock.setSDKInstance(AWS);
  AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
    callback(null, {Item:{
      dead_array: [0,0],
      isolation: graphParams.isolation,
      infected_array: [1,2],
      immune_array: [0,0],
      vars_hash: graphHash,
      social_distance: graphParams.social_distance,
      population: graphParams.population,
      healthy_array: [99,98],
      total_runs: 1
    }})
  })
  AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
    callback(null, {
      Item: {
        ...graphParams,
        healthy_array: [198,196,97,97,96],
        dead_array: [0,0,0,0,0],
        infected_array: [2,4,3,3,2],
        immune_array: [0,0,0,0,2],
        total_runs: 2,
        vars_hash: graphHash
      }
    })
  })

  const newAvgGraph = await graphService.addGraphToAvg({
    ...graphParams,
    healthy_array: new_healthy_array,
    dead_array: new_dead_array,
    infected_array: new_infected_array,
    immune_array: new_immune_array
  })
  expect(newAvgGraph.total_runs).toBe(2)
  expect(newAvgGraph.healthy_array.length).toBe(5)
  expect(newAvgGraph.healthy_array[0]).toBe(198)
  expect(newAvgGraph.dead_array[4]).toBe(0)
  expect(newAvgGraph.infected_array[0]).toBe(2)
  expect(newAvgGraph.immune_array[4]).toBe(2)
  AWSMock.restore('DynamoDB.DocumentClient');
})

test('getAvgGraph returns an item', async function() {
  const graphParams = {isolation:0, social_distance:0, population:0}
  const graphHash = "4741eb9abc7c4e824f1e0ed7e40ef632e286d977";
  AWSMock.setSDKInstance(AWS);
  AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
    callback(null, {Item:{
      dead_array: [0,0],
      isolation: graphParams.isolation,
      infected_array: [0,1],
      immune_array: [0,0],
      vars_hash: graphHash,
      social_distance: graphParams.social_distance,
      population: graphParams.population,
      healthy_array: [99,98],
      total_runs: 1
    }})
  })
  const item = await graphService.getAvgGraph(graphParams);
  expect(item.population).toBe(0);
  AWSMock.restore('DynamoDB.DocumentClient');
})