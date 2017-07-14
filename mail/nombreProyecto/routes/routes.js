const express = require('express');
var pass = 'luzbelito';
const router = express.Router();

var Imap = require("imap");
var MailParser = require("mailparser").MailParser;
var Promise = require("bluebird");
Promise.longStackTraces();




router.get('/prueba/post/', (req, res) => {

    var imapConfig = {
        user: 'jpico841@gmail.com',
        password: pass,
        host: 'imap.gmail.com',
        port: 993,
        tls: true
    };

    var imap = new Imap(imapConfig);
    Promise.promisifyAll(imap);

    imap.once("ready", execute);
    imap.once("error", function (err) {
        //log.error("Connection error: " + err.stack);
    });

    imap.connect();

    function execute() {
        imap.openBox("INBOX", false, function (err, mailBox) {
            console.log(mailBox);
            if (err) {
                console.error(err);
                return;
            }
            imap.search(["UNSEEN"], function (err, results) {
                console.log(results);
                if (!results || !results.length) { console.log("No unread mails"); imap.end(); return; }

                imap.setFlags(results, ['\\Seen'], function (err) {
                    if (!err) {
                        console.log("marked as read");
                    } else {
                        console.log(JSON.stringify(err, null, 2));
                    }
                });

                var f = imap.fetch(results, { bodies: "" });
                f.on("message", processMessage);
                f.once("error", function (err) {
                    return Promise.reject(err);
                });
                f.once("end", function () {
                    console.log("Done fetching all unseen messages.");
                    imap.end();
                });
            });
        });
    }


    function processMessage(msg, seqno) {
        console.log("Processing msg #" + seqno);
        var parser = new MailParser();
        parser.on("headers", function (headers) {
            console.log("Header: " + JSON.stringify(headers));
        });

        parser.on('data', data => {
            if (data.type === 'text') {
                //console.log(seqno); 
                console.log("MESSAGE: " + data.text);
               // console.log("HTML: " + data.html); 
            }

            if (data.type === 'attachment') {
                console.log(data.filename);
                data.content.pipe(process.stdout);
                data.content.on('end', () => data.release());
            }
        });

        msg.on("body", function (stream) {
            stream.on("data", function (chunk) {
                parser.write(chunk.toString("utf8"));
            });
        });
        msg.once("end", function () {
            console.log("Finished msg #" + seqno);
            parser.end();
        });

        // Mover los mail de "principal", solo los mueve a la carpeta "todo"
        // msg.on('end', function () {
        //    imap.seq.addFlags(seqno, '\\Deleted', function (err) { });
        //});
        
    };

    res.send("Start app");

});


module.exports = router;
