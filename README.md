## Tourilize - Band And Genre Tour Visulization 

### Background and Overview

Tourilize is a live and interactive site to visualize band tour dates and genres with geographic data over time. Users will be able to Enter a Genre or Band and see the tour history (and up coming) dates and locations of those bands or genres. Using this tool users can see the frequency, intensity and patterns of different genre's making their way around the world. 

## Functionality & MVP

* Enter a band or genre of music 
* interact with a map to both zoom and articulate the time axis 
* View a map of the locations (and order) of the touring 

## Wireframe

This app will only need a single view, with a text input box and selectors for genre or artist. The map displayed with be able to be moused around. 


## Architecture and Technologies
* Javascript 
* JQuery / Vanilla DOM manipulation 
* Various relevant API's such as Last.fm, Songkick, BandsInTown, etc. 
* D3 to data visulization
* Weback for bundling

There will be three scripts needed:
* A script to handle user input and queries to the APIs 
* A script to manipulate and prepare this datsa with D3
* A script to control the UI and final presentation from D3

## Timeline 

Day 1:
* Have a basic site with the user input fields that fetches and displays the raw JSON objects from the relevant APIs. 
* Skeletons for all files. 

Day 2:
* Manipulate data using D3 into relevant segments 

Day 3: 
* Display the manipulated data with a basic representation of the geographic mapping

Day 4: 
* Styling and UI Polish 

## Bonus features 
* Additional parameters or data to map such as populairty 
* An interactive scroll for time 
* Correlate to tweet data mentoning Bands / Genres 
* Clicking on elements links to relevant bands / venues. 
* Hover pop ups with additional information on each edge on the graph. 

