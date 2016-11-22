"use strict";

let user = require("./user"),
	db = require("./dbInteraction"),
	cards = require("./movieCards.js");



/*AUTHENTICATE/ SIGN IN*/
$("#signIn").click(function() {
  console.log("authenticate");
  user.logInGoogle()
  .then(function(result){
    let user = result.user;
    $("#signIn").addClass("hide");
    $("#signOut").removeClass("hide");
    $("#radioAll").removeAttr("checked", "checked");
    $("#radioYour").removeAttr("disabled", "disabled");	

  });
});

$("#signOut").click(function (){
	location.reload();
});

/*SEARCH EVENT LISTENERS*/
$("#search").click(function () {
	console.log("search");
	let query = $("#query").val();
	console.log("query", query);
	db.searchOMDB(query);
	$("#query").val('');
});

$("#query").keydown(function(e) {
	if(e.keyCode === 13) { 
	console.log("entersearch");
	let query = $("#query").val();
	console.log("query", query);
	db.searchOMDB(query);
	$("#query").val('');
	}
});

/*FIlTER EVENT LISTENERS*/

$("#radioAll").change(function () {
	console.log("radioAll", this);
});

$("#radioYour").change(function () {
	console.log("radioYour", this);
});

$("#allMovies").click(function (){
	console.log("allMovies",this);
});

$("#watchedMovies").click(function (){
	console.log("watchedMovies",this);
});

$("#notWatchedMovies").click(function (){
	console.log("notWatchedMovies",this);
});

// console.log("testing WITH array");
// cards.cardBuilder(["a", "b"]);
// console.log("testing WITH string");
// cards.cardBuilder("snarf");






