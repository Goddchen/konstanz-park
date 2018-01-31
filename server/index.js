var schedule = require('node-schedule');
var jsftp = require('jsftp');
var xmljs = require('xml-js');
var MongoClient = require('mongodb').MongoClient;

console.log("Server started");

var job = schedule.scheduleJob('0 * * * * *', function() {
  console.log("Trying to download updated data from FTP server");
  var ftp = new jsftp({
    host: 'www.konstanz.de',
    user: 'parktemp',
    pass: 'Meat!ho2'
  });
  ftp.get("P_einrichtungenKonstanzNeu.xml", (err, socket) => {
    if(err) {
      console.error("Error getting file: " + err);
      return;
    }
    var content = "";
    socket.on("data", d => {
      content += d.toString();
    });
    socket.on("close", err => {
      if(err) {
        console.error("Error getting file: " + err);
      } else {
        console.log("XML downloaded");
        var result = xmljs.xml2js(content, {compact: true});
        MongoClient.connect('mongodb://db:27017', (err, client) => {
          if(err) {
            console.error("Error connecting to MongoDB: " + err);
          } else {
            console.log("Connected to MongoDB");
            const db = client.db('park-db');
            result.parkierungseinrichtungen.einrichtung.forEach(parkhaus => {
              console.log("Inserting " + parkhaus.stammdaten.bezeichnung._text);
              db.collection('parkhaus').updateOne({
                'index': parkhaus._attributes.index
              },
              {
                $set: {
                  index: parkhaus._attributes.index,
                  art: parkhaus._attributes.art,
                  bezeichnung: parkhaus.stammdaten.bezeichnung._text,
                  bereich: parkhaus.stammdaten.bereich._text,
                  kapazitaet: parkhaus.stammdaten.kapazitaet._text
                }
              },
              {
                upsert: true
              });
              db.collection('auslastung').insertOne({
                index: parkhaus._attributes.index,
                timestamp: new Date(),
                status: parkhaus.belegung._attributes.status,
                frei: parkhaus.belegung._attributes.frei,
                belegt: parkhaus.belegung._attributes.belegt,
                tendenz: parkhaus.belegung._attributes.tendenz
              });
            });
            console.log("Disconnecting from MongoDB");
            client.close();
          }
        });
      }
      ftp.raw('quit', (err, data) => {
        if(err) {
          console.error("Error disconnecting: " + err);
        }
        console.log("Disconnecting from FTP");
        ftp.socket.destroy();
      });
    });
    socket.resume();
  });
});
