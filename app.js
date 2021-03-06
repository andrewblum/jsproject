const express = require('express');
const app = express();
// const http = require('http').Server(app)
const path = require('path');
const fetch = require('node-fetch');
const PORT = process.env.PORT || 8000;
const countries = require('country-list')();
const $ = require('jquery');
var parseString = require('xml2js').parseString;
var parser = require('xml2json');

app.listen(PORT, () => {
  console.log(__dirname);
  console.log(`listening on ${PORT}`);
});
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//get top 50 artist objects for a genre (tag)
app.get('/genre_top_50/:genre', (req, res) => {
  let results;
  fetch(`http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=${req.params.genre}&api_key=0d3ece2f1080c69c00cf22e84789d7a3&format=json`)
    .then(function(response) {
        return response.text();
    }).then(function(body) {
        results = JSON.parse(body);
        results = results.topartists.artist.map(singleArtist => singleArtist.name);
        res.send(results);
    });
});

//get shows for each of the top 50 artist of a genre
app.get('/shows_for_genre/:genre', (req, res) => {
  let results;
  fetch(`http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=${req.params.genre}&api_key=0d3ece2f1080c69c00cf22e84789d7a3&format=json`)
    .then(function(response) {
        return response.text();
    }).then(function(body) {
        results = JSON.parse(body);
        results = results.topartists.artist.map(singleArtist => singleArtist.name);
        showsFromNames(results).then(r => {
          res.send(r);
        });
    });
});

//hard coded to US right now
app.get('/num_shows_for_genre/:genre', (req, res) => {
  let results;
  let countryCount = {};
  fetch(`http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&limit=250&country=United%20States&tag=${req.params.genre}&api_key=0d3ece2f1080c69c00cf22e84789d7a3&format=json`)
    .then(function(response) {
        return response.text();
    }).then(function(body) {
        results = JSON.parse(body);
        results = results.topartists.artist.map(singleArtist => singleArtist.name);
        numShowsByCountryFromNames(results).then(r => {
          res.send(r);
        });
    });
});

//get top 50 artist of every country
app.get('/country', (req, res) => {
  let topArtistByCountry = {};
  let promiseArr = [];
  let result;
  Object.keys(countries.getNameList()).forEach(country => {
    promiseArr.push(topBandsForCountry(country));
  });
  Promise.all(promiseArr).then(resultArr => {
    resultArr.forEach(singleResult => {
      if (singleResult && singleResult.topartists &&
        singleResult.topartists.artist) {
        topArtistByCountry[singleResult.topartists['@attr'].country] = singleResult.topartists.artist.map(artist => artist.name);
      }
    });
    res.send(topArtistByCountry);
  }).catch(error => console.log(error));
});

//NASS USDA Api call
app.get('/ag_commodity_for_states/:commodity', (req, res) => {
  let promiseArr = [];
  let resultHash = {};
  Object.keys(STATES).forEach(state => {
    promiseArr.push(agCommodityForState(req.params.commodity, state))
  });
  Promise.all(promiseArr).then(resultArr => {
    resultArr.forEach(singleResult => {
      resultHash[singleResult.state] = singleResult.count;
    })
    res.send(resultHash);
  }).catch(error => console.log(error))
});

//utils

async function agCommodityForState(commodity, state) {
  return fetch(`http://quickstats.nass.usda.gov/api/get_counts/?key=DD68082C-DD59-33E5-9844-A8924A1AC3DF&commodity_desc=${commodity}&year__GE=2012&state_alpha=${state}`)
    .then(function(response) {
      return response.text();
    })
    .then(function(body) {
      let result = JSON.parse(body);
      result['state'] = state;
      return result;
    }).catch(error => console.log(error))
}


async function showsFromNames(arr) {
  let promiseArr = [];
  let shows = {};
  arr.forEach(artist => {
    promiseArr.push(bandsintownShowsFromName(artist));
  });
  await Promise.all(promiseArr).then(resultArr => {
    resultArr.forEach(singleResult => {
      if (singleResult.length > 0) {
        shows[singleResult[0].artist_id] = singleResult;
      }
    });
  }).catch(error => console.log(error));
  return shows;
};

//hard coded the US right now
async function numShowsByCountryFromNames(arr) {
  let promiseArr = [];
  let shows = {};
  arr.forEach(artist => {
    promiseArr.push(bandsintownShowsFromName(artist));
  });
  await Promise.all(promiseArr).then(resultArr => {
    resultArr.forEach(singleResult => {
      if (singleResult.length > 0) {
        singleResult.forEach(show => {
          if (shows[show.venue.region] && show.venue.country === 'United States') {
            shows[show.venue.region] += 1;
          }
          if (show.venue.country === 'United States' && !shows[show.venue.region]) {
            shows[show.venue.region] = 1;
          }
        });
      }
    });
  }).catch(error => console.log(error));
  return shows;
};

async function eventfulShowsFromName(artist) {
  return fetch(`http://api.eventful.com/rest/events/search?...&keywords=${artist}&app_key=DPv5KKhqfgdKTxQm`)
    .then(function(response) {
      return response.text();
    })
    .then(async function(xml) {
      let result = await parser.toJson(xml);
      return result;
    })
    .catch((error) => console.log(error))
};

async function bandsintownShowsFromName(artist) {
  return fetch(`https://rest.bandsintown.com/artists/${artist}/events?app_id=songtourvisual`)
    .then(function(response) {
      return response.text();
    })
    .then(function(body) {
      let result = JSON.parse(body);
      return result;
    }).catch(error => error);
}

const topBandsForCountry = (country) => (
  fetch(`http://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=${country}&api_key=0d3ece2f1080c69c00cf22e84789d7a3&format=json`)
    .then(function(response) {
      return response.text();
    })
    .then(function(body) {
      let result = JSON.parse(body);
      return result;
    }).catch((error) => console.log(error))
);

const STATES = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FL": "Florida",
    "GA": "Georgia",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PA": "Pennsylvania",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
};
