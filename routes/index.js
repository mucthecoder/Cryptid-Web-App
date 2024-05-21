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

router.get('/create-map', function(req, res, next) {
  const filePath = path.join(__dirname, "../public/customplay.html");
  res.sendFile(filePath);
});
router.get('/replay', function(req, res, next) {
  const filePath = path.join(__dirname, "../public/replay.html");
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
router.get('/maps/normal', function(req, res, next) {
  const directoryPath = path.join(__dirname, '../public/maps/normal');
  
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

// router.get('/profile', (req, res) => {
//   if (!req.isAuthenticated() || (!req.session && !req.session.user_id )) {
//     return res.redirect('/login');
//   }
//   return res.redirect('/home');
//     // res.send(`<h1>Hello ${req.user.displayName}</h1>`);
// });

module.exports = router;
