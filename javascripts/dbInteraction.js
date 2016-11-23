"use strict";

let firebase = require("./fb-config"),
	cards = require("./movieCards.js"),
	user = require("./user.js");

function searchOMDB(title) {
	let sumArray = [];
	return new Promise(function(resolve,reject) {
		$.ajax({
			url: `http://www.omdbapi.com/?s="${title}"&y=&plot=short&r=json`
		}).done(function(movieData) {
			// console.log("movieData from searchOMDB", movieData);
			// console.log("movieData.Poster", movieData.Poster);
			// console.log("movieData.Title", movieData.Title);
			// console.log("movieData.Year", movieData.Year);
			// console.log("movieData.Actors", movieData.Actors);
			// console.log("movieData.Plot", movieData.Plot);
			resolve(movieData);
			let currentUser = user.getUser();
			// console.log("currentUser during search", currentUser);
			let OMDBArray = movieData.Search;
			// sumArray = sumArray.concat(OMDBArray);
			// console.log("sumArray after omdb", sumArray);
			let firebaseResults = new Promise((resolve, reject)=>{
				$.ajax({
					url: `https://moviehistory-f323f.firebaseio.com/movies.json?orderBy="uid"&equalTo="${currentUser}"`
				}).done((firebaseMovies)=>{
					// console.log("firebaseMovies", firebaseMovies);
					resolve(firebaseMovies);

					let idArray = Object.keys(firebaseMovies); //takes an array of objects and returns an array of the keys ON that object
					idArray.forEach(function(key){
					  firebaseMovies[key].id = key;
					  // console.log("key", key);
					});

					console.log("firebaseMovies", firebaseMovies);

					// console.log("firebaseMovies", firebaseMovies);
						// console.log("title", title);
					

					let fbArray = $.map(firebaseMovies, function(value, index) {
					    return [value];
					});
					console.log("fbArray", fbArray);


					let filteredMovies = $.grep(fbArray, (value, index) => {
						// console.log("value", value);
						return value.Title === title;
					});

					console.log("filteredMovies", filteredMovies);


					// sumArray = sumArray.concat(firebaseMovies);
					sumArray = sumArray.concat(filteredMovies);
					console.log("sumArray after fb", sumArray);

					sumArray = sumArray.concat(OMDBArray);
					console.log("sumArray after omdb", sumArray);
					
					cards.cardBuilder(sumArray);

					// sumArray = sumArray.concat(firebaseMovies);
				});
			});
    		});



		});
	
}






// }

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
	movieObject.isWatched = false;
	movieObject.uid = user.getUser();
	// movieObject.id = 
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
	} else {
		user.logInGoogle();
		 $("#signIn").addClass("hide");
		 $("#signOut").removeClass("hide");
	}
}

function removeFromFirebase(deleteID) {
	return new Promise((resolve, reject)=>{
		$.ajax({
			url: `https://moviehistory-f323f.firebaseio.com/movies/${deleteID}.json`,
			// url: `https://moviehistory-f323f.firebaseio.com/movies.json?orderBy="imdbID"&equalTo="${deleteID}"`,
			method: "DELETE"
		}).done(()=>{
			resolve();
		});
	});
}

module.exports = {searchOMDB, searchID, addToFirebase, removeFromFirebase};

