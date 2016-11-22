"use strict";

const OUTPUT = $("#movieOutput");

let cards = {};
cards.cardBuilder = (movieData) => {
	OUTPUT.html('');
	let cardsString = '',
		outputString;
	// let movieArray = movieData.Search;

	if (Array.isArray(movieData)) {
		// console.log("movieData is an array");
	} else {
		movieData = [movieData];
		// console.log("movieData is not an array");
	}
	// console.log("movieArray", movieArray);
	movieData.forEach((value, index) => {
		// console.log("value", value);
		console.log("index", index);
		if(index % 3 === 0){ 
			cardsString = `<div class="row">`;
		}

		cardsString += `<div id="movieCard--${index}" class="col-md-4 movieCard"><h2>${value.Title}</h2><img class="moviePoster" src="${value.Poster}"></div>`;
		
		if ((index + 1) % 3 === 0) {
			cardsString += `</div>`;
		} else if (index === movieData.length - 1) {
			cardsString += `</div>`;
		}
		outputString += cardsString;
		cardsString = '';
		console.log("cardsString", cardsString);
	});
	OUTPUT.append(outputString);
};

module.exports = cards;


