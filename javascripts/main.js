"use strict";

let user = require("./user"),
	db = require("./dbInteraction"),
	cards = require("./movieCards.js"),
	Formatter = require("./formatUserInput");



/*AUTHENTICATE/ SIGN IN*/
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

/*SEARCH EVENT LISTENERS*/
$("#search").click(function () {
	searcher();
	// console.log("search");
	// let query = $("#query").val();
	// console.log("query", query);
	// db.searchOMDB(query);
	// $("#query").val('');
});

function searcher() {
	console.log("search");
	let query = Formatter.allReplace($("#query").val());
	console.log("query", query);
	db.searchOMDB(query);
	// $("#query").val('');
}



// $("#search").click(function () {
// 	console.log("search");
// 	let query = $("#query").val();
// 	console.log("query", query);
// 	db.searchOMDB(query);
// 	$("#query").val('');
// });

$("#query").keydown(function(e) {
	if(e.keyCode === 13) { 
	e.preventDefault();
	searcher();
	// console.log("entersearch");
	// let query = $("#query").val();
	// console.log("query", query);
	// db.searchOMDB(query);
	// $("#query").val('');
	}
});

// $("#movieOutput").click(function () {
// 	console.log("this", event.target.id);
// 	let ID = event.target.id;
// 	db.searchID(ID)
// 	.then((movieObject) => {

// 	});

// });

$(document).on("click", ".addToListBtn", () => {
	console.log("this", event.target.id);
	let ID = event.target.id;
	db.searchID(ID)
	.then((movieObject) => {
		db.addToFirebase(movieObject);
	});
});

/*FIlTER EVENT LISTENERS*/

// $("#radioAll").change(function () {
// 	console.log("radioAll", this);
// });

// $("#radioYour").change(function () {
// 	console.log("radioYour", this);
// });

$("#showUntrackedBtn").click(function (){
	console.log("showUntrackedBtn",this);
});

$("#showUnwatchedBtn").click(function (){
	console.log("showUnwatchedBtn",this);
});

$("#showWatchedBtn").click(function (){
	console.log("showWatchedBtn",this);
});

$("#favoritesBtn").click(function (){
	console.log("favoritesBtn",this);
});

$(document).on("click", ".addToListBtn", () => {
	db.addToFirebase();
});

$(document).on("click", ".deleteBtn", (e) => {
	let movieID = $(event.target).data("delete-id");
	// let movieID = $(this).data("delete-id");
	// console.log("$(this)", $(this));
	console.log("movieID", movieID);
	db.removeFromFirebase(movieID)
	.then(()=>{
		$(event.target).parents(".movieCard").remove();
		searcher();
	});

});


// console.log("testing WITH array");
// cards.cardBuilder(["a", "b"]);
// console.log("testing WITH string");
// cards.cardBuilder("snarf");






