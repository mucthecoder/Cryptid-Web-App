var express = require('express');
var router = express.Router();
var path = require('path');
const fs = require('fs');

//handle game setup 
router.get('/', function(req, res, next) {
  const filePath = path.join(__dirname, "../public/index.html");
  res.sendFile(filePath);
});

router.get('/home', function(req, res, next) {
  const filePath = path.join(__dirname, "../public/home.html");
  res.sendFile(filePath);
});

router.get('/custom-room', function(req, res, next) {
  const filePath = path.join(__dirname, "../public/game_room.html");
  res.sendFile(filePath);
});

router.get('/maps/intro', function(req, res, next) {
  const directoryPath = path.join(__dirname, '../public/maps/intro');
  
  fs.readdir(directoryPath, function(err, files) {
    if (err) {
      return res.status(500).send('Error reading directory');
    }

    const jsonFiles = files.filter(file => file.endsWith('.json'));

    if (jsonFiles.length === 0) {
      return res.status(404).send('No JSON files found');
    }
    const randomJsonFile = jsonFiles[Math.floor(Math.random() * jsonFiles.length)];

    res.json({randomJsonFile});
  });
});

router.get('/game-mode', function(req, res, next) {
  const filePath = path.join(__dirname, "../public/game_mode.html");
  res.sendFile(filePath);
});

router.get('/join-room', function(req, res, next) {
  const filePath = path.join(__dirname, "../public/join_room.html");
  res.sendFile(filePath);
});

router.get('/create-room', function(req, res, next) {
  const filePath = path.join(__dirname, "../public/create_room.html");
  res.sendFile(filePath);
});
router.get('/browse-rooms', function(req, res, next) {
  const filePath = path.join(__dirname, "../public/browse_room.html");
  res.sendFile(filePath);
});

router.get('/waiting', function(req, res, next) {
  const filePath = path.join(__dirname, "../public/waiting.html");
  res.sendFile(filePath);
});

module.exports = router;
