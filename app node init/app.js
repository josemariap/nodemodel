const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const app = express();

const config = require("./config/config");
const routes = require('./module/routes/routes');


function initMiddlewares() {

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(morgan('combined'));
    app.use(cookieParser());


}
//probar-->postman post: http://localhost:3010/api/group/post/1500009410029510
function initRoutes() {
    app.use('/api', routes);
}

function initServer() {
    app.listen(config.server.port, () => {
        console.log("Started application");
        console.log("Port: " + config.server.port);
        console.log("Host: " + config.server.url);
        console.log("Version: " + config.server.version);
    });
}


initMiddlewares();
initRoutes();
initServer();
