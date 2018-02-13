const express = require('express');
const app = express();
// const http = require('http').Server(app)
const path = require('path');
const fetch = require('node-fetch');
const PORT = process.env.PORT || 8000;
const countries = require('country-list')();

app.use(express.static('public'));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//get top 50 artist objects for a genre (tag)
app.get('/genre/:genre', (req, res) => {
  let results;
  fetch(`http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=${req.params.genre}&api_key=0d3ece2f1080c69c00cf22e84789d7a3&format=json`)
    .then(function(response) {
        return response.text();
    }).then(function(body) {
        results = JSON.parse(body);
        // console.log(results.topartists.artist);
        // console.log(typeof body);
        // console.log(body.length);
        // console.log(JSON.parse(body)[0]);
        res.send(results);
    });
});

//get top 50 artist of every country
app.get('/country', (req, res) => {
  let topArtistByCountry = {};
  let result;
  Object.keys(countries.getNameList()).forEach(country => {
    topArtistByCountry[country] = topBandsForCountry(country);
    console.log(topBandsForCountry(country));
  });
  res.send(topArtistByCountry);
});


app.listen(PORT, () => {
  console.log(__dirname);
  console.log(`listening on ${PORT}`);
});




//utils

const showsFromNames = (obj) => {

};

const artistNames = (arr) => {
  let artistsNames = [];
  arr.forEach(artist =>
    artistNames.push(artist.name)
  );
  return artistsNames;
};

const topBandsForCountry = (country) => {
  let result;
  fetch(`http://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=${country}&api_key=0d3ece2f1080c69c00cf22e84789d7a3&format=json`)
    .then(function(response) {
      return response.text();
    })
    .then(function(body) {
      result = JSON.parse(body);
    });
  return result;
};
