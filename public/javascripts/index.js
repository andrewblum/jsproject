import Chart from 'chart.js';

document.addEventListener('DOMContentLoaded', () => {
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
        display: true,
        text: 'upcoming shows for the 250 most popular bands for a genre by state'
      },
      tooltips: {
        mode: 'point'
      }
    }
  });

  // document.getElementById('metal').addEventListener('click', function() {
  //   bubbleChartData.datasets.forEach(function(dataset) {
  //     dataset.data = dataset.data.map(function() {
  //       return {
  //         x: randomScalingFactor(),
  //         y: randomScalingFactor(),
  //         r: Math.abs(randomScalingFactor()) / 5,
  //       };
  //     });
  //   });
  //   window.myChart.update();
  // });

  document.getElementById('genre-form').addEventListener('submit', e => {
    e.preventDefault();
    console.log(e);
    let genre = document.getElementById('genre-input').value;
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
    });
  });




});


function reDrawData(data) {
  let newDatasets = [];
    Object.keys(data).forEach((key) => {
      newDatasets.push({
        label: key,
        backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
        borderColor: window.chartColors.red,
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
	datasets: [{
		label: 'Data 1 thing',
		backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
		borderColor: window.chartColors.red,
		borderWidth: 1,
		data: [{
			x: randomScalingFactor(),
			y: randomScalingFactor(),
			r: Math.abs(randomScalingFactor()) / 5,
		}]
	}, {
		label: 'Data 2 thing',
		backgroundColor: color(window.chartColors.orange).alpha(0.5).rgbString(),
		borderColor: window.chartColors.orange,
		borderWidth: 1,
		data: [{
			x: randomScalingFactor(),
			y: randomScalingFactor(),
			r: Math.abs(randomScalingFactor()) / 5,
		}]
	}]
};
