const AWS = require('aws-sdk')
const AWSMock = require('aws-sdk-mock')
const graphService = require("./graphService")

test('compositeGraph properly composes', function () {
  const expected = "0-0";
  const actual = graphService.compositeGraph({ isolation: 0, social_distance: 0.0 });
  expect(actual).toBe(expected);
})

test('addGraphToAvg adds a graph to average, new array is larger', async function () {
  const graphParams = { isolation: 0, social_distance: 0, population: 0 }
  const graphComposite = "0-0";
  const healthy_array = [99, 98, 97, 97, 96]
  const dead_array = [0, 0, 0, 0, 0]
  const immune_array = [0, 0, 0, 0, 2]
  const infected_array = [1, 2, 3, 3, 2]
  AWSMock.setSDKInstance(AWS);
  AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
    callback(null, {
      Item: {
        dead_array: [0, 0],
        isolation: graphParams.isolation,
        infected_array: [1, 2],
        immune_array: [0, 0],
        vars_composite: graphComposite,
        social_distance: graphParams.social_distance,
        population: graphParams.population,
        healthy_array: [99, 98],
        total_runs: 1
      }
    })
  })
  AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
    callback(null, params.Item);
  })

  const newAvgGraph = await graphService.addGraphToAvg({
    ...graphParams,
    healthy_array,
    dead_array,
    infected_array,
    immune_array
  })
  expect(newAvgGraph.total_runs).toBe(2)
  expect(newAvgGraph.healthy_array.length).toBe(5)
  expect(newAvgGraph.healthy_array[0]).toBe(198)
  expect(newAvgGraph.dead_array[4]).toBe(0)
  expect(newAvgGraph.infected_array[0]).toBe(2)
  expect(newAvgGraph.immune_array[4]).toBe(2)
  AWSMock.restore('DynamoDB.DocumentClient');
})

test('getAvgGraph returns an item', async function () {
  const graphParams = { isolation: 0, social_distance: 0, population: 0 }
  const graphComposite = "0-0";
  AWSMock.setSDKInstance(AWS);
  AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
    callback(null, {
      Item: {
        dead_array: [0, 0],
        isolation: graphParams.isolation,
        infected_array: [0, 1],
        immune_array: [0, 0],
        vars_composite: graphComposite,
        social_distance: graphParams.social_distance,
        population: graphParams.population,
        healthy_array: [99, 98],
        total_runs: 1
      }
    })
  })
  const item = await graphService.getAvgGraph(graphParams);
  expect(item.population).toBe(0);
  AWSMock.restore('DynamoDB.DocumentClient');
})

const _setupSearchMock = (population) => {
  AWSMock.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
    expect(params.TableName).toBe('covid_sim_graph_run_avg');
    expect(params.KeyConditionExpression).toBe("#vars_composite >= :zero and #pop = :n");
    expect(params.ExpressionAttributeValues[':n']).toBe(population);
    callback(null, {
      Items: [
        {
          isolation: 0,
          population: population,
          social_distance: 0
        }
      ]
    })
  });
}

test('searchGraphListbyPopulation returns a graph list by population', async () => {
  AWSMock.setSDKInstance(AWS);

  _setupSearchMock(100);
  await graphService.searchGraphListByPopulation(100);
  AWSMock.restore('DynamoDB.DocumentClient');

  _setupSearchMock(20);
  await graphService.searchGraphListByPopulation(20);
  AWSMock.restore('DynamoDB.DocumentClient');
})