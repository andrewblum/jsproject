## Tourilize - Band And Genre Tour Visulization 

### Background and Overview

Tourilize is a live and interactive site to visualize band tour dates and genres with geographic data over time. Users will be able to enter a genre and see number of shows sorted by location into a bubble graph. Each bubble will represent a location (such as a State), and it's size will represent number of shows in that location for the chosen genre.

## Functionality & MVP

* Enter a genre of music 
* View a graph of the frequency of those genres at locations 

## Wireframe

This app will only need a single view, with a text input box and selectors for genre or artist. The map displayed with be able to be moused around. 

![alt text](https://imgur.com/pOVGJCZ.png)

## Architecture and Technologies
* Javascript 
* JQuery / Vanilla DOM manipulation 
* Various relevant API's such as Last.fm, Songkick, BandsInTown, etc. 
* Chart.js
* Node backend for the API calls
* Weback for bundling

There will be three scripts needed:
* A script to handle user input and queries to the APIs 
* A script to manipulate and prepare this data to be drawn by Chart.js
* A script to control the UI and final presentation using Chart.js

## Timeline 

Day 1:
* Have a basic site with the user input fields that fetches and displays the raw JSON objects from the relevant APIs. 
* Skeletons for all files. 

Day 2:
* Manipulate data into relevant segments for use by Chart.js

Day 3: 
* Display the manipulated data with Chart.js into a bubble graph

Day 4: 
* Styling and UI Polish 

## Bonus features 
* Directional edged graph showing the tour progress of bands in the genre accross a map
* D3 instead of Chart.js
* Additional parameters or data to map such as populairty 
* An interactive scroll for time 
* Correlate to tweet data mentoning Bands / Genres 
* Clicking on elements links to relevant bands / venues. 
* Hover pop ups with additional information on each edge on the graph. 

