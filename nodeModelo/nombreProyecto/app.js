'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000

function initMiddlewares() {
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
}


function initServer(){
  app.listen(port,()=>{
    console.log(`Api corriendo en http://localhost:${port}` );
  });
}

function example(){
   console.log("Inicio de la app")
}

example();
initMiddlewares();
initServer();
