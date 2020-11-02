# covid-sim-server
This is the API server for the Covid Sim System

## development
### prerequisites
the development environment requires access to a dynamodb service. you can
do this by either creating a dynamodb table in an AWS instance you have access
keys for or use a local dev mock dynamodb service.

in either case, you will need to have your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
configured in your .env in order to run the server locally. a mock dynamodb service
should provide these to you.

### dynamodb table creation

there is one dynamodb table that needs to be created in your AWS system for the
server to work. that table can be created with the AWS CLI as follows:

```
aws dynamodb create-table --billing-mode PAY_PER_REQUEST \
  --table-name 'dev_covid_sim_graph_run_avg' \
  --key-schema AttributeName=population,KeyType=HASH \
      AttributeName=vars_composite,KeyType=RANGE \
  --attribute-definitions AttributeName=population,AttributeType=N \
      AttributeName=vars_composite,AttributeType=S
```

### setup
* fork and clone this repo to your local machine
* create a .env file in the root of the project that contains the following:
  * COVIDSIM_AUTHKEY=devkey
  * AWS_ACCESS_KEY_ID=<your aws access key id>
  * AWS_SECRET_ACCESS_KEY=<your aws secret access key>
  * ADMIN_USER=admin_user
  * ADMIN_PASSWORD=password
  * COVID_SERVER_PORT=8081
  * DDB_COVIDSIM_DATABASE_NAME=dev_covid_sim_graph_run_avg
  * NODE_ENV=development
* open a console window and start the covid sim admin client by entering `yarn start`

the server should show a message about what port it will be running on

## deployment
these will be generic instructions on getting this node.js application
installed in a server of your choice.

## pre-requisites
the pre-requisites for the server to install this application on are:
* node.js must be installed on the server
* must be able to unpack packed node.js application
* the server must be reachable by ip address and whatever port number(s) you specify in the .env file. make sure to record the ip address.

## install instructions

1. pack the node application with `npm run build`. this will create `covid-sim-server-1.0.0.tgz` in the `build` directory
2. scp the `covid-sim-server-1.0.0.tgz` file to your prepared server
3. when your packed file is on your server, unpack the file with `tar -xvzf covid-sim-server-1.0.0.tgz`
4. change into the "package" directory: `cd package`
5. install the npm modules: `npm install --production`
6. install the pm2 npm module: `npm install -g pm2`
8. configure the server by creating a .env file
  * if you dont specify a port, the default will be 8081.
9. start the server in the background and managed by pm2: `pm2 start ./index.js`