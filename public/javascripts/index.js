import Chart from 'chart.js';
import L from 'leaflet';

document.addEventListener('DOMContentLoaded', () => {
  loadGenre('Smooth Jazz');
  Window.commodity = 'MUSHROOMS';
  loadAg();
  var ctx = document.getElementById('canvas').getContext('2d');
  window.myChart = new Chart(ctx, {
    type: 'bubble',
    data: bubbleChartData,
    options: {
      legend: {
        display: false
      },
      responsive: true,
      title: {
        display: false,
        text: 'upcoming shows for the 250 most popular bands for a genre by state'
      },
      tooltips: {
        callbacks: {
           label: function(t, d) {
              return STATES[d.datasets[t.datasetIndex].label] + ' '
                + Window.commodity + ': ' + Math.floor(t.yLabel);
           }
        },
        mode: 'point'
      },
      scaleLabel: {
        display: false
      }
    }
  });

  document.getElementById('genre-form').addEventListener('submit', e => {
    e.preventDefault();
    let genre = document.getElementById('genre-input').value;
    loadGenre(genre);
  });


  function loadGenre(genre) {
    fetch(`/num_shows_for_genre/${genre}`)
    .then(response => {
      return response.json();
    })
    .then(body => {
      genreData = body;
      return body;
    })
    .then(data => {
      reDrawData(data);
    })
    .then(() => {
      fetch(`/shows_for_genre/${genre}`)
        .then(response => {
          return response.json();
        })
        .then(body => {
          mapShows(body);
          return body;
        });
    });
  }

  document.getElementById('ag-form').addEventListener('submit', e => {
    e.preventDefault();
    Window.commodity = document.getElementById('ag-input')
      .value.toUpperCase();
    loadAg();
  });

  function loadAg() {
  fetch(`/ag_commodity_for_states/${Window.commodity}`)
    .then(response => {
      return response.json();
    })
    .then(body => {
      return body;
    })
    .then(data => {
      reDrawX(data);
    });
  }

  Window.map = L.map('map', {attributionControl: false}).setView([40, -50], 3);
  let tile = L.tileLayer('https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: '',
    maxZoom: 18,
    id: 'mapbox.dark',
    accessToken: 'sk.eyJ1IjoiYW5kcmV3Ymx1bSIsImEiOiJjamRvdnBjOGYwcXRmMnhxcGc3MW1jdDUwIn0.PTE1CiY6Ju_Quj75YZ4RSQ'
  });
  tile.addTo(Window.map);
  Window.map.scrollWheelZoom.disable();
});

function mapShows(obj) {
  Object.keys(obj).forEach(id => {
    Object.keys(obj[id]).forEach(showId => {
      let show = obj[id][showId];
      let lineup = show.lineup;
      let date = show.datetime.slice(0,10);
      let venue = show.venue.name;
      let lat = parseFloat(show.venue.latitude);
      let lng = parseFloat(show.venue.longitude);
      let marker = L.marker([lat, lng]).addTo(Window.map);
      marker.bindPopup(`${lineup} @ ${venue} \n ${date}`);
    });
  });
}

function reDrawX(data) {
  bubbleChartData.datasets.forEach(function(dataset) {
      dataset.data[0].y = data[dataset.label];
  });
  window.myChart.update();
}

function reDrawData(data) {
  let newDatasets = [];
    Object.keys(data).forEach((key) => {
      newDatasets.push({
        label: key,
        backgroundColor: color(window.chartColors.pink).alpha(0.5).rgbString(),
        borderColor: window.chartColors.pink,
        borderWidth: 1,
        data: [{
          x: randomScalingFactor(),
          y: randomScalingFactor(),
          r: data[key]
        }]
      });
    });
  bubbleChartData.datasets = newDatasets;
  window.myChart.update();
}

window.chartColors = {};
window.chartColors.red = 'rgba(255, 99, 132, 0.2)';
window.chartColors.orange = 'rgba(200, 199, 132, 0.2)';
window.chartColors.pink = 'rgba(239, 108, 151, 0.2)';

const randomScalingFactor = function() {
  return Math.random() * 100;
};

var genreData = {};
var DEFAULT_DATASET_SIZE = 7;
var addedCount = 0;
var color = Chart.helpers.color;
var bubbleChartData = {
	animation: {
		duration: 10000
	},
	datasets: []
};

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

//mapbox
//sk.eyJ1IjoiYW5kcmV3Ymx1bSIsImEiOiJjamRvdnBjOGYwcXRmMnhxcGc3MW1jdDUwIn0.PTE1CiY6Ju_Quj75YZ4RSQ
