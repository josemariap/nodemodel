//GOOGLE DRIVE
/* Link de la consola del gmail jpico841@gmail.com  -->  https://console.developers.google.com/apis/credentials?project=cosmic-dialect-172718&pli=1
<file:filename-wildcard-filter pattern="#[message.inboundProperties.'http.query.params'.file]"/>   */
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
//ejecutar este file con node, devuelve una url que la egamos en el navegador y retorna un codigo que lo pegamos en la consola, enter y lee el drive
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json



var SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Drive API.
  authorize(JSON.parse(content), listFiles);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */

function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  oauth = oauth2Client;
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function (err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
      console.log("ENTRE")
      console.log(oauth2Client);

      //insertFile(oauth2Client);
      // createFolder(oauth2Client);
       var fileId = '0B3n88xMxyhKtMFJPZi1SRW9lQVE'; //id file
       deleteFile(fileId, oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function (code) {
    rl.close();
    oauth2Client.getToken(code, function (err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  var service = google.drive('v3');
  service.files.list({
    auth: auth,
    pageSize: 10,
    fields: "nextPageToken, files(id, name)"
  }, function (err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var files = response.files;
    if (files.length == 0) {
      console.log('No files found.');
    } else {
      console.log('Files:');
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        console.log('%s (%s)', file.name, file.id);
      }
    }
  });
}


/************************************************************************** */

//Insert into folder 
function insertFile(oauth2Client) {
  var drive = google.drive({ version: 'v2', auth: oauth2Client });
  console.log("*************");
  console.log(drive);

  var folderId = '0B3n88xMxyhKtTXBhWi1lOGt5Ums';
  fileMetadata = {
    'title': 'miarchivo.txt',
    'mimeType': 'file/txt',
    parents: [{ id: folderId }]
  };
  media = {
    mimeType: 'file/txt',
    body: fs.createReadStream('files/archivo.txt')
  };
  drive.files.insert({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, function (err, file) {
    if (err) {
      console.log(err);
    } else {
      console.log('File Id: ', file.id);
    }
  });

}

//Create folder 
function createFolder(oauth2Client) {
  var drive = google.drive({ version: 'v3', auth: oauth2Client });
  var fileMetadata = {
    'name': 'Archivos',
    'mimeType': 'application/vnd.google-apps.folder'
  };
  drive.files.create({
    resource: fileMetadata,
    fields: 'id'

  }, function (err, file) {
    if (err) {
      console.log(err);
    } else {
      console.log('Folder Id: ', file.id);
    }
  });
}

//Trash file
function deleteFile(fileId, oauth2Client) {
  var drive = google.drive({ version: 'v2', auth: oauth2Client });
  drive.files.delete({
    'fileId': fileId
  }, function (resp) { });
}


/****************************************************************** */


