"use strict";

let user = require("./user"),
	db = require("./dbInteraction"),
	cards = require("./movieCards.js"),
	Formatter = require("./formatUserInput"),
	userID,
	imdbID,
	lastKnownRating = null,
	rating,
	recentSearch = "";



 //////////////////////////////////////////////
    //        Auth/Sign-In
    //////////////////////////////////////////////
$("#signIn").click(function() {
  console.log("authenticate");
  user.logInGoogle()
  .then(function(result){
    let user = result.user;
    $("#signIn").addClass("hide");
    $("#signOut").removeClass("hide");
   
  });
});

$("#signOut").click(function (){
	user.logOut();
	location.reload();
});

 //////////////////////////////////////////////
    //        Search Events
    //////////////////////////////////////////////
$("#search").click(function () {
	searcher();
		$("#breadCrumbs").text("Movie History > Search Results");

});

function searcher() {
	let query = Formatter.allReplace($("#query").val());
	recentSearch = query;
	db.searchOMDB(query)
	.then(setStarListeners);
}

$("#query").keydown(function(e) {
	if(e.keyCode === 13) { 
	e.preventDefault();
	searcher();
	$("#breadCrumbs").text("Movie History > Search Results");

	}
});


 //////////////////////////////////////////////
    //       Filter Event Listeners
    //////////////////////////////////////////////

$(document).on("click", ".addToListBtn", () => {
	let ID = event.target.id;
	console.log("ID", ID);
	db.searchID(ID)
	.then((movieObject) => {
		// console.log("movieObject", movieObject);
		db.addToFirebase(movieObject);
	});
});

$("#showUntrackedBtn").click(function (){
	$(this).attr("selected", "selected");
	$("#breadCrumbs").text("Movie History > Untracked Flicks");
	db.searchOMDB(recentSearch)
	.then(setStarListeners);
});

$("#showUnwatchedBtn").click(function (){
	$(this).attr("selected", "selected");
	$(this).toggleClass("filter");
	$("#showWatchedBtn").removeClass("filter");
	$("#favoritesBtn").removeClass("filter");	 
	$("#query").val('');
	userID = user.getUser();
	db.getMoviesFromFirebase(userID)
	.then(setStarListeners);
	$("#breadCrumbs").text("Movie History > Unwatched Flicks");
});

$("#showWatchedBtn").click(function (){
	$(this).attr("selected", "selected");
	$(this).addClass("filter");
	$("#showUnwatchedBtn").removeClass("filter");
	$("#favoritesBtn").removeClass("filter");
	$("#query").val('');
	let uid = user.getUser();
	db.loadWatched(true,uid)
	.then(setStarListeners);
	$("#breadCrumbs").text("Movie History > Not So Favorite Flicks");
});


$("#favoritesBtn").click(function (){
	$(this).attr("selected", "selected");
	$("#showWatchedBtn").removeClass("filter");
	$("#showUnwatchedBtn").removeClass("filter");
	$(this).addClass("filter");

	$("#query").val('');
	let uid = user.getUser();
	db.loadFavorites(10,uid)
	.then(setStarListeners);
	$("#breadCrumbs").text("Movie History > Favorite Flicks");
});

 //////////////////////////////////////////////
    //        Delete Event
    //////////////////////////////////////////////


$(document).on("click", ".deleteBtn", (event) => {
	let movieID = $(event.target).data("delete-id");
	db.removeFromFirebase(movieID)
	.then(()=>{
		userID = user.getUser();
		if ($("#showWatchedBtn").hasClass("filter")) {
			db.loadWatched(true,userID)
			.then(setStarListeners);
		} else if ($("#favoritesBtn").hasClass("filter")) {
			db.loadFavorites(10,userID)
			.then(setStarListeners);
		} else {
			db.getMoviesFromFirebase(userID)
			.then(setStarListeners);
		}
	});

});

function setStarListeners(){
	let numStarBars = $('.example');
	console.log("numStarBars", numStarBars);
	console.log("numStarBars.length",numStarBars.length );
	for (let i = 0; i < numStarBars.length; i++){
		console.log("adding event listener to " + $(numStarBars[i]));
		$(numStarBars[i]).change(starListener);
	}
}

function starListener(event){
  
  let favoriteMovie = event.target.closest('.movieCard').getAttribute("data--imdb-id");
	console.log("favoriteMovie", favoriteMovie);  
  let rating = event.target.getAttribute('value');
  if (rating === null || rating === lastKnownRating) {
	  console.log("rating stayed the same:", rating);
  } else {
  	lastKnownRating = rating;
  	console.log("rating changed to:", rating);
  	db.setWatched(favoriteMovie,rating);
  }

}









