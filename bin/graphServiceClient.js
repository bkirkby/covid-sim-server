const graphService = require('../graphService');

graphService.getAvgGraph({population:100,social_distance:4.5,isolation:.2})
  .then(function(res){console.log('res: ', res)})
  .catch(function(err){console.log('err: ', err)})