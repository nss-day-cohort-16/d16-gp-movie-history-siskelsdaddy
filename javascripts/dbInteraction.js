"use strict";

let firebase = require("./fb-config"),
	cards = require("./movieCards.js"),
	user = require("./user.js");

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

function searchID(ID) {
	console.log("ID", ID);
	return new Promise(function(resolve,reject) {
		$.ajax({
			url: `http://www.omdbapi.com/?i=${ID}&plot=short&r=json`
		}).done(function(movieData) {
			console.log("movieData from searchOMDB", movieData);
			resolve(movieData);
			cards.cardBuilder(movieData);
		});
	});
}

function addToFirebase(movieObject) {
	movieObject.uid = user.getUser();
	if (movieObject.uid) {
		console.log("movieObject", movieObject);
		return new Promise((resolve,reject) => {
			$.ajax({
				url: 'https://moviehistory-f323f.firebaseio.com/movies.json',
				type: "POST",
				data: JSON.stringify(movieObject),
				dataType: 'json'
			});
		});
	}
}

module.exports = {searchOMDB, searchID, addToFirebase};

