const express = require('express');
const router = express.Router();
const request = require('request');
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

router.get('/prueba/upload/', (req, res) => {
    
        var upload = 'https://lh3.googleusercontent.com/-p46ks1ykBzE/AAAAAAAAAAI/AAAAAAAAAFQ/OEkUOCHwNOU/photo.jpg';
        var url = 'https://graph.facebook.com/287544715050657/photos?access_token=DQVJ0aE13RXd2bERyWDF1NHVZAY25FdWVWblNqUjJkVUVuUUFpZAE5jOVhwSnRWQnNmejB6ZAmswOXlfNFR2czVBcm84X1hDbnluZAHRDcDVZARzNoTGk3d0JEZAGFlMmg0QXhqSUFhcC1FSDBfOUc4TkVUM2FKZA2dySzNvZAU5vekFyUlplNi1MUm5PeDNvbGkwN0Y4ZAXVRYWwwWVF5MW1lVDVsc3NoSzNjWHJ4VHRaSERod3c3dE14dU9vbmt4T1lhWXhJSEl5NWZA5RlJ3eE0xbUtqSwZDZD';
        var form = {
            message:'hola',
            url: upload
        };
    
        request.post({url, form}, function (err, resp, body) {
            if (err) console.log(err);
    
            if (body.hasOwnProperty('error')) { //Respuesta de facebook con error viene en el body
               res.send({
                    message: 'Error',
                    response: body
                })
            } else {
                res.send({
                    message: 'Ok publish',
                    response: body   //Respuesta id de publish ok
                })
            }
          
    
        });





    
















    res.send("Response");
})

module.exports = router;

