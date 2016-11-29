"use strict";

// var db = require("./dbInteraction.js"),
// var user = require("./user"),
    // dbUtils = require("./dbUtils"),
var favoriteMovie,
    rating,
    initRatings = [],
    array = [];

const OUTPUT = $("#movieOutput");

//////////////////////////////////////////////
//        Card Builder Logic
//////////////////////////////////////////////

function cardBuilder(movieObj) {

  if (Array.isArray(movieObj)) {
  } else {
    movieObj = [movieObj];
  }

let movieData = movieObj;
  if (movieData[0] === undefined) {
    movieData = [{
      Title: `No Results Found for "${$('#query').val()}"`,
      Poster: 'https://thumbs.dreamstime.com/t/film-clapper-board-video-icon-30142238.jpg',
      // http://img2-ak.lst.fm/i/u/770x0/798712572d104cb39411b4ad986fc8cb.jpg
      id: null
    }];
  }

  OUTPUT.html('');
  let cardsString = '',
    outputString = '';


  let currentActors,
  currentDeleteButton,
  addButton;
  movieData.forEach((value, index) => {

    initRatings[index] = value.rating;

    if (value.Actors === undefined) {
      currentActors = '';
    } else {
      currentActors = `<p>Actors: ${value.Actors}</p>`;
    }


    // if (index % 3 === 0) {
      cardsString = `<div class="row">`;
    // }

    //////////////////////////////////////////////
    //        Star rating variable
    //////////////////////////////////////////////
    
    let stars = '<select class="example"><option id="opt" value=""></option><option id="opt" value="1">1</option><option id="opt" value="2">2</option><option id="opt" value="3">3</option><option id="opt" value="4">4</option><option id="opt" value="5">5</option><option id="opt" value="6">6</option><option id="opt" value="7">7</option><option id="opt" value="8">8</option><option id="opt" value="9">9</option><option id="opt" value="10">10</option></select>';

    //////////////////////////////////////////////
    //        Build Cards
    //////////////////////////////////////////////

     if (value.id === undefined) {
      currentDeleteButton = '';
      stars = '';
      addButton = `<a id="${value.imdbID}" href="#" class="btn addToListBtn btn-primary">Add to Watchlist</a>`;
    } else if (value.isWatched === true || value.rating) {
      // stars = `<p>You gave this ${value.rating}/10 stars</p>`;
      currentDeleteButton = `<a data-delete-id="${value.id}" href="#" class="close deleteBtn ">x</a>`;
      addButton = '';
    } else {
      currentDeleteButton = `<a data-delete-id="${value.id}" href="#" class="close deleteBtn ">x</a>`;
      addButton = '';
    }

    /*any poster address that contains ia or had a value of N/A returned no img so i replaced with ODB*/
    
    if (value.Poster.indexOf("ia") > -1 || value.Poster === "N/A") {
      value.Poster = 'https://thumbs.dreamstime.com/t/film-clapper-board-video-icon-30142238.jpg';
    }


    cardsString += `<div id="movieCard--${index}" data--imdb-id="${value.imdbID}" class="col-md-3 col-md-offset-1 movieCard">
        ${currentDeleteButton}
    <h3>${value.Title}</h3>
    <img class="moviePoster" src="${value.Poster}">${currentActors}
    <div class="btn">
        ${addButton}
      </div>${stars}</div>`;

//////////////////////////////////////////////
//        Closing Div Logic
//////////////////////////////////////////////

    // if ((index + 1) % 3 === 0) {
      // cardsString += `</div>`;
    // } else 
    if (index === movieData.length - 1) {
      cardsString += `</div>`;
    }
    outputString += cardsString;
    cardsString = '';
  });

  OUTPUT.append(outputString);
}

function getInitRatings(){
  return initRatings;
}

module.exports = {cardBuilder, array, getInitRatings};
