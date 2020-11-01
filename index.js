const express = require('express')
const morgan = require('morgan')
const logger = require('./logger')
var cors = require('cors')
const graphService = require('./graphService')
require('dotenv').config()

const corsWhiteList = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://covidsim.now.sh',
  undefined
];
const corsOptions = {
  origin: (origin, callback) => {
    if (corsWhiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('not allowed by cors'));
    }
  }
}

const app = express()

const port = 8081
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors(corsOptions))

function simpleAuth(req, res, next) {
  logger.debug('simpleAuth called')
  if (req.get("Authorization") === process.env.COVIDSIM_AUTHKEY) {
    next();
  } else {
    res.status(403).json({ error: "admin key not valid" });
  }
}

app.post('/getGraph', simpleAuth, async (req, res) => {
  if (!req.body.isolation, !req.body.social_distance, !req.body.population) {
    res.status(400).json({ message: "required params not found: isolation, social_distance, or population" });
  }
  const graph_data = await graphService.getAvgGraph(req.body);
  res.status(200).json(graph_data);
})

app.post('/addGraph', (req, res) => {
  graphService.addGraphToAvg(req.body)
  res.send(200);
})

app.get('/getGraphList', simpleAuth, async (req, res) => {
  const graph_data = await graphService.getGraphList().catch(err => {
    res.status(500).json({ error: err });
  });
  res.status(200).json(graph_data);
})

app.get('/searchGraphListByPopulation', simpleAuth, async (req, res) => {
  const population = parseInt(req.query.population, 10);

  const graph_data = await graphService.searchGraphListByPopulation(population).catch(err => {
    res.status(500).json({ error: err });
  });
  res.status(200).json(graph_data);
})

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
    res.status(200).json({ key: process.env.COVIDSIM_AUTHKEY });
  } else {
    res.status(403).json({ error: 'invalid login' });
  }
})

app.listen(port, () => console.log(`app running on port ${port}`))
