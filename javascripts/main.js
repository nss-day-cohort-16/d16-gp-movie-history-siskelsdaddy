"use strict";

let user = require("./user"),
    db = require("./dbInteraction"),
    cards = require("./movieCards.js"),
    Formatter = require("./formatUserInput"),
    userID,
    imdbID,
    lastKnownRating = null,
    rating,
    recentSearch = "",
    initRatings = cards.getInitRatings();

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
    $(`[data--imdb-id=${ID}]`).hide();
  });
});

$("#showUntrackedBtn").click(function (){
  $(this).attr("selected", "selected");
  $("#favMenu").removeClass('active');
  $("#breadCrumbs").text("Movie History > Untracked Flicks");
  db.searchOMDB(recentSearch)
  .then(setStarListeners);
});

$("#showUnwatchedBtn").click(function (){
  $(this).attr("selected", "selected");
  $(this).toggleClass("filter");
  $("#favMenu").removeClass('active');
  $("#showWatchedBtn").removeClass("filter");
  $("#favoritesBtn").removeClass("filter");
  $("#query").val('');
  userID = user.getUser();
  db.getMoviesFromFirebase(userID)
  .then(function setStarListeners(){
  $('.example').each(function(index, item){
    $(item).barrating('show', {
      theme: 'bootstrap-stars',
      initialRating: initRatings[index],
      silent: true,
      onSelect: function(value, text, event) {
        let favoriteMovie = event.target.closest('.movieCard').getAttribute("data--imdb-id");
        let parentEl = $(event.target).parents()[1];
        parentEl.firstChild.setAttribute('value', value);
        $(parentEl.firstChild).barrating('set', value);
        db.setWatched(favoriteMovie, value);
         $(`[data--imdb-id=${favoriteMovie}]`).hide();
      }
    });
  });
});
  $("#breadCrumbs").text("Movie History > Unwatched Flicks");
});

$("#showWatchedBtn").click(function (){
  $(this).attr("selected", "selected");
  $(this).addClass("filter");
  $("#favMenu").removeClass('active');
  $("#showUnwatchedBtn").removeClass("filter");
  $("#favoritesBtn").removeClass("filter");
  $("#query").val('');
  let uid = user.getUser();
  db.loadWatched(true,uid)
  .then(setStarListeners);
  $("#breadCrumbs").text("Movie History > Not So Favorite Flicks");
});

$("#favoritesBtn10").click(function (){
  $("#favMenu").addClass('active');
  $("#showWatchedBtn").removeClass("filter");
  $("#showUnwatchedBtn").removeClass("filter");
  $(this).addClass("filter");

  $("#query").val('');
  let uid = user.getUser();
  db.loadFavorites(10,uid)
  .then(setStarListeners);
  $("#breadCrumbs").text("Movie History > Favorite Flicks > 10 Stars");
});

$("#favoritesBtn9").click(function (){
  $("#favMenu").addClass('active');
  $("#showWatchedBtn").removeClass("filter");
  $("#showUnwatchedBtn").removeClass("filter");
  $(this).addClass("filter");

  $("#query").val('');
  let uid = user.getUser();
  db.loadFavorites(9,uid)
  .then(setStarListeners);
  $("#breadCrumbs").text("Movie History > Favorite Flicks > 9 Stars Or More");
});

$("#favoritesBtn8").click(function (){
  $("#favMenu").addClass('active');
  $("#showWatchedBtn").removeClass("filter");
  $("#showUnwatchedBtn").removeClass("filter");
  $(this).addClass("filter");

  $("#query").val('');
  let uid = user.getUser();
  db.loadFavorites(8,uid)
  .then(setStarListeners);
  $("#breadCrumbs").text("Movie History > Favorite Flicks > 8 Stars Or More");
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
      db.loadFavorites(10, 10,userID)
      .then(setStarListeners);
    } else {
      db.getMoviesFromFirebase(userID)
      .then(setStarListeners);
    }
  });
});

function setStarListeners(){
  $('.example').each(function(index, item){
    $(item).barrating('show', {
      theme: 'bootstrap-stars',
      initialRating: initRatings[index],
      silent: true,
      onSelect: function(value, text, event) {
        let favoriteMovie = event.target.closest('.movieCard').getAttribute("data--imdb-id");
        let parentEl = $(event.target).parents()[1];
        parentEl.firstChild.setAttribute('value', value);
        $(parentEl.firstChild).barrating('set', value);
        db.setWatched(favoriteMovie, value);
      }
    });
  });
}