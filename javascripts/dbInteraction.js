"use strict";

let firebase = require("./fb-config"),
	cards = require("./movieCards.js"),
	user = require("./user.js");

	var favoriteArray = [],
		notSoFavoriteArray = [];

  //////////////////////////////////////////////
    //        Open Search Function
    //////////////////////////////////////////////

function searchOMDB(title) {
	let sumArray = [];
	return new Promise(function(resolve,reject) {
		$.ajax({
			url: `http://www.omdbapi.com/?s="${title}"&y=&plot=short&r=json`
		}).done(function(movieData) {
			resolve(movieData);
			let currentUser = user.getUser();
			let OMDBArray = movieData.Search;
			let firebaseResults = new Promise((resolve, reject)=>{
				$.ajax({
					url: `https://moviehistory-f323f.firebaseio.com/movies.json?orderBy="uid"&equalTo="${currentUser}"`
				}).done((firebaseMovies)=>{
					resolve(firebaseMovies);

					let idArray = Object.keys(firebaseMovies); 
					idArray.forEach(function(key){
					  firebaseMovies[key].id = key;
					});

					let fbArray = $.map(firebaseMovies, function(value, index) {
					    return [value];
					});


					let filteredMovies = $.grep(fbArray, (value, index) => {
						return value.Title === title;
					});
					sumArray = sumArray.concat(filteredMovies);
					sumArray = sumArray.concat(OMDBArray);
					cards.cardBuilder(sumArray);
				});
			 });
    	});
	});
}


function searchID(ID) {
	return new Promise(function(resolve,reject) {
		$.ajax({
			url: `http://www.omdbapi.com/?i=${ID}&plot=short&r=json`
		}).done(function(movieData) {
			resolve(movieData);
		});
	});
}

 //////////////////////////////////////////////
    //        Update User Movies/Check For Auth
    //////////////////////////////////////////////

function addToFirebase(movieObject) {
	movieObject.isWatched = false;
	movieObject.uid = user.getUser();
	if (movieObject.uid) {
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

 //////////////////////////////////////////////
    //        Get Users Movies
    //////////////////////////////////////////////

function getMoviesFromFirebase(userID) {
	return new Promise((resolve,reject) => {
		$.ajax({
			url: `https://moviehistory-f323f.firebaseio.com/movies.json?orderBy="uid"&equalTo="${userID}"`,
		}).done((userMovies) => {
			let returnedArray = $.map(userMovies, function(value, index) {
				value.id = index;
				if (value.isWatched === false) {
					console.log("value",value);
					    return [value];
					}
					});
			cards.cardBuilder(returnedArray);
			resolve(userMovies);
		});
	});
}

 //////////////////////////////////////////////
    //        Remove From Users DB
    //////////////////////////////////////////////

function removeFromFirebase(deleteID) {
	return new Promise((resolve, reject)=>{
		$.ajax({
			url: `https://moviehistory-f323f.firebaseio.com/movies/${deleteID}.json`,
			method: "DELETE"
		}).done(()=>{
			resolve();
		});
	});
}

 //////////////////////////////////////////////
    //        Set Users Watched/Favorites
    //////////////////////////////////////////////

function setWatched(imdbID,rating) {
	return new Promise((resolve,reject) => {
		$.ajax({
			url: `https://moviehistory-f323f.firebaseio.com/movies.json?orderBy="imdbID"&equalTo="${imdbID}"`,
		}).done((favorites) => {
			let watchedArray = $.map(favorites, function(value, index) {
				value.id = index;
				value.isWatched = true;
				value.rating = rating;
					    return [value];
					});

					function findType(obj) { 
				    return obj.id;
				}

				if (watchedArray.rating < 10) {
					var notSoFavoriteObj = watchedArray.find(findType);
					let id = notSoFavoriteObj.id;
					updateFirebase(notSoFavoriteObj,id);

				} else {
					var favObj = watchedArray.find(findType);
					let id = favObj.id;
					updateFirebase(favObj,id);
				}

			resolve(favorites);
		});
	});
}

 //////////////////////////////////////////////
    //        Update User DB With New Props
    //////////////////////////////////////////////


function updateFirebase(watched,id) {	
	return new Promise((resolve,reject) => {
		$.ajax({
			url: `https://moviehistory-f323f.firebaseio.com/movies/${id}.json`,
			type: "PUT",
			data: JSON.stringify(watched),
			dataType: 'json'
		});
	});
}

 //////////////////////////////////////////////
    //       Load Users Not So Fav Flicks
    //////////////////////////////////////////////


function loadWatched(watched,uid) {
	return new Promise((resolve,reject) => {
		$.ajax({
			url: `https://moviehistory-f323f.firebaseio.com/movies.json?orderBy="isWatched"&equalTo=${watched}`,
		}).done((userMovies) => {
			let returnedArray = $.map(userMovies, function(value, index) {
				value.id = index;
				if(value.uid === uid) {
					console.log("wacthedvalue", value);
					    return [value];
					}
					});
			cards.cardBuilder(returnedArray);
			resolve(userMovies);
		});
	});
}

 //////////////////////////////////////////////
    //       Load Users Fav Flicks
    //////////////////////////////////////////////

function loadFavorites(rating,uid) {
	return new Promise((resolve,reject) => {
		$.ajax({
			url: `https://moviehistory-f323f.firebaseio.com/movies.json?orderBy="rating"&equalTo="${rating}"`,
		}).done((userMovies) => {
			let returnedArray = $.map(userMovies, function(value, index) {
				value.id = index;
				if (value.uid === uid) {
					    return [value];
				}
					});
			cards.cardBuilder(returnedArray);
			resolve(userMovies);
		});
	});
}
module.exports = {searchOMDB, searchID, addToFirebase, removeFromFirebase, getMoviesFromFirebase, setWatched, loadFavorites, loadWatched};




























