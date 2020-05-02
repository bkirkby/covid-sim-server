const AWS = require('aws-sdk')

const client = new AWS.SecretsManager({region: 'us-east-1'})

client.getSecretValue({SecretId: 'prod/CovidSim/ApiKey'}, function(err, data) {
  if (err) {
    console.error('bk: err: ', err)
  } else {
    console.log('bk: data: ', data)
  }
})