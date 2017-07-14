var requester = require("request");
var querystring = require("querystring");
var config = require('../../config/config');

function postMessage(groupId, body) {

    return new Promise((resolve, reject) => {
    
        var data = {
            message: body.saludo,
        };

        var formData = querystring.stringify(data);
        var contentLength = data.length;

        requester({
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            uri: config.facebook.url + groupId + '/feed/?access_token=' + config.facebook.token,
            body: formData,
            method: 'POST'
        }, function (err, res, body) { resolve(body)
           
           });
        

    })



}

//--------------------------------------------------------------------------------------------------------------------

module.exports = {
    postMessage
}



// token
//access_token=DQVJ0aE13RXd2bERyWDF1NHVZAY25FdWVWblNqUjJkVUVuUUFpZAE5jOVhwSnRWQnNmejB6ZAmswOXlfNFR2czVBcm84X1hDbnluZAHRDcDVZARzNoTGk3d0JEZAGFlMmg0QXhqSUFhcC1FSDBfOUc4TkVUM2FKZA2dySzNvZAU5vekFyUlplNi1MUm5PeDNvbGkwN0Y4ZAXVRYWwwWVF5MW1lVDVsc3NoSzNjWHJ4VHRaSERod3c3dE14dU9vbmt4T1lhWXhJSEl5NWZA5RlJ3eE0xbUtqSwZDZD

//postaman publicar foto en un grupo por id
/* https://graph.facebook.com/287544715050657/photos?access_token=DQVJ0aE13RXd2bERyWDF1NHVZAY25FdWVWblNqUjJkVUVuUUFpZAE5jOVhwSnRWQnNmejB6ZAmswOXlfNFR2czVBcm84X1hDbnluZAHRDcDVZARzNoTGk3d0JEZAGFlMmg0QXhqSUFhcC1FSDBfOUc4TkVUM2FKZA2dySzNvZAU5vekFyUlplNi1MUm5PeDNvbGkwN0Y4ZAXVRYWwwWVF5MW1lVDVsc3NoSzNjWHJ4VHRaSERod3c3dE14dU9vbmt4T1lhWXhJSEl5NWZA5RlJ3eE0xbUtqSwZDZD   */
//imagen paremtro url: https://lh3.googleusercontent.com/-p46ks1ykBzE/AAAAAAAAAAI/AAAAAAAAAFQ/OEkUOCHwNOU/photo.jpg

// el resopnse en data me devuelve el/los id del album
//Traer albunes de un grupo, paso el id del grupo:
//GET https://graph.facebook.com/287544715050657/albums?access_token=DQVJ0aE13RXd2bERyWDF1NHVZAY25FdWVWblNqUjJkVUVuUUFpZAE5jOVhwSnRWQnNmejB6ZAmswOXlfNFR2czVBcm84X1hDbnluZAHRDcDVZARzNoTGk3d0JEZAGFlMmg0QXhqSUFhcC1FSDBfOUc4TkVUM2FKZA2dySzNvZAU5vekFyUlplNi1MUm5PeDNvbGkwN0Y4ZAXVRYWwwWVF5MW1lVDVsc3NoSzNjWHJ4VHRaSERod3c3dE14dU9vbmt4T1lhWXhJSEl5NWZA5RlJ3eE0xbUtqSwZDZD
//traer un album por id GET  id album :https://graph.facebook.com/287921508346311?access_token=DQVJ0aE13

//fotos de un album id del album GET :https://graph.facebook.com/287618235043305/photos?access_token=DQV


//likes de una foto, GET y id de la imagen: https://graph.facebook.com/109258846361117/likes?access_token=DQVJ0aE
//fecha creacion posteo de imagen GET y id imagen: https://graph.facebook.com/109258846361117?access_token=DQV

//Likes a objetos seleccionados por id POST: https://graph.facebook.com/107336223220046/likes?access_token=DQVJ0

/*todos los posteos de un usuario: user id, tipo GET
https://graph.facebook.com/100018310058913/feed?access_token=DQVJ0aE13RXd2bERyWDF1NHVZAY25FdWVWblNqUjJkVUVuUUFpZAE5jOVhwSnRWQnNmejB6ZAmswOXlfNFR2czVBcm84X1hDbnluZAHRDcDVZARzNoTGk3d0JEZAGFlMmg0QXhqSUFhcC1FSDBfOUc4TkVUM2FKZA2dySzNvZAU5vekFyUlplNi1MUm5PeDNvbGkwN0Y4ZAXVRYWwwWVF5MW1lVDVsc3NoSzNjWHJ4VHRaSERod3c3dE14dU9vbmt4T1lhWXhJSEl5NWZA5RlJ3eE0xbUtqSwZDZD  
 */

//https://graph.facebook.com/{object-id}7/likes?access_token={token}
//integracion personalizada: https://graph.facebook.com/me?access_token=
