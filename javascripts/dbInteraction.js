"use strict";

let firebase = require("./fb-config"),
	cards = require("./movieCards.js");

function searchOMDB(title) {
	return new Promise(function(resolve,reject) {
		$.ajax({
			url: `http://www.omdbapi.com/?s="${title}"&y=&plot=short&r=json`
		}).done(function(movieData) {
			console.log("movieData from searchOMDB", movieData);
			// console.log("movieData.Poster", movieData.Poster);
			// console.log("movieData.Title", movieData.Title);
			// console.log("movieData.Year", movieData.Year);
			// console.log("movieData.Actors", movieData.Actors);
			// console.log("movieData.Plot", movieData.Plot);
			resolve(movieData);
			cards.cardBuilder(movieData.Search);
		});
	});
}

module.exports = {searchOMDB};