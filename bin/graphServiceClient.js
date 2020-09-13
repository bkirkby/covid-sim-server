const graphService = require('../graphService');
require('dotenv').config();

// graphService.addGraphToAvg({population:100,social_distance:4.5,isolation:.2})

graphService.getAvgGraph({population:100,social_distance:4.5,isolation:.2})
  .then(function(res){
    console.log('res: ', res);
    console.log('res.healthy_array: ', res.healthy_array);
  })
  .catch(function(err){console.log('err: ', err)})

// graphService.putAvgGraph({
//   population:101,
//   social_distance: 4.5,
//   isolation:.2,
//   dead_array: [],
//   healthy_array: [],
//   immune_array: [],
//   infected_array: []
// })
//   .then(function(res) {
//     console.log("res: ", res)
//   })
//   .catch(function(err){
//     console.log("err: ", err)
//   })