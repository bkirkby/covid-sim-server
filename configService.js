function getConfig() {
  return {
    COVIDSIM_AUTHKEY: process.env.COVIDSIM_AUTHKEY || 'devauthkey',
    AWS_CONFIG: {
      region: process.env.AWS_REGION || 'us-east-1'
    }
  }
}

exports.getConfig = getConfig