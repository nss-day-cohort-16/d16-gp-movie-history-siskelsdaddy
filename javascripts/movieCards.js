"use strict";

const OUTPUT = $("#movieOutput");

let cards = {};
cards.cardBuilder = (movieData) => {
	console.log("movieData", movieData);
	OUTPUT.html('');
	let cardsString = '',
		outputString = '';
	// let movieArray = movieData.Search;

	if (Array.isArray(movieData)) {
		// console.log("movieData is an array");
	} else {
		movieData = [movieData];
		// console.log("movieData is not an array");
	}
	// console.log("movieArray", movieArray);


///////////     selection view filter pseudo logic

	// if (show untracked is selected) {
	// 	filter down to only OMDB results that are not included in firebase
	//} else if (show unwatched is selected) {
	// 	filter array to only movies with isWatched = false;
	// } else if (show watched is selected) {
	// 	filter array to only movies with isWatched = true;
	// } else if (show favorites is selected) {
	// 	filter results to only movies with a 10 star rating
	// }
	//THEN the array will continue onto the cardbuilder as usual

//////////////////
	console.log("movieData", movieData);

	let currentActors,
		currentDeleteButton,
		addButton;
	movieData.forEach((value, index) => {
		if (value.Actors === undefined) {
			 currentActors = '';
		} else {
			 currentActors = `<p>Actors: ${value.Actors}</p>`;
		}


		if (value.id === undefined) {
			currentDeleteButton = '';
			addButton = `<a id="${value.imdbID}" href="#" class="btn addToListBtn btn-primary">Add to Watchlist</a>`;
		} else {
			currentDeleteButton = `<a data-delete-id="${value.id}" href="#" class="btn deleteBtn btn-primary">Remove from Watchlist</a>`;
			addButton = '';
		}

		// console.log("value", value);
		// console.log("index", index);
		if(index % 3 === 0){ 
			cardsString = `<div class="row">`;
		}

		cardsString += `<div id="movieCard--${index}" data--imdb-id="${value.imdbID}" class="col-md-4 movieCard">
		<h2>${value.Title}</h2>
		<img class="moviePoster" src="${value.Poster}">${currentActors}
		<div class="btn-group btn-group-justified">
	      ${addButton}
	      ${currentDeleteButton}
	    </div></div>`;
		
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


