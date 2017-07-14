'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

const app = express();
const port = process.env.PORT || 3000

function initMiddlewares() {
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
}

function initRoutes() {
    app.use('/api', routes);
}

function initServer(){
  app.listen(port,()=>{
    console.log(`Api corriendo en http://localhost:${port}` );
  });
}




initMiddlewares();
initServer();
initRoutes();