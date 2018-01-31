var mongoose = require('mongoose');
var express = require('express')

var app = express();

mongoose.connect("mongodb://db/park-db");
var ParkhausSchema = new mongoose.Schema({
});
var AuslastungSchema = new mongoose.Schema({
}, {
  collection: 'auslastung'
});
var ParkhausModel = mongoose.model('parkhaus', ParkhausSchema);
var AuslastungModel = mongoose.model('auslastung', AuslastungSchema);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/current', (req, res) => {
  ParkhausModel.find((err, parkhausData) => {
    AuslastungModel.aggregate([{
        $sort: {
          timestamp: -1
        }
      }, {
        $group: {
          _id: "$index",
          frei: { "$first": "$frei"},
          timestamp: { "$first": "$timestamp"}
        }
      }
    ], (err, data) => {
      res.send({parkhausData: parkhausData, data: data});
    });
  });
});
app.get('/park/:id', (req, res) => {
  ParkhausModel.findOne({index: req.params.id}, (err, parkhaus) => {
    res.send(parkhaus);
  });
});
app.get('/park', (req, res) => {
  ParkhausModel.find((err, data) => {
    res.send(data);
  });
});
app.listen(3000, () => {
  console.log("API started");
});
