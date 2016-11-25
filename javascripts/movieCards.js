"use strict";

var db = require("./dbInteraction"),
favoriteMovie,
rating,
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
      Poster: 'http://img2-ak.lst.fm/i/u/770x0/798712572d104cb39411b4ad986fc8cb.jpg',
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

    if (value.Actors === undefined) {
      currentActors = '';
    } else {
      currentActors = `<p>Actors: ${value.Actors}</p>`;
    }


    if (index % 3 === 0) {
      cardsString = `<div class="row">`;
    }
    //////////////////////////////////////////////
    //        Star rating variable
    //////////////////////////////////////////////
    let stars = '<div class="br-wrapper br-theme-fontawesome-stars"><select class="example"><option id="opt" value=""></option><option id="opt" value="1">1</option><option id="opt" value="2">2</option><option id="opt" value="3">3</option><option id="opt" value="4">4</option><option id="opt" value="5">5</option><option id="opt" value="6">6</option><option id="opt" value="7">7</option><option id="opt" value="8">8</option><option id="opt" value="9">9</option><option id="opt" value="10">10</option></select></div>';

    //////////////////////////////////////////////
    //        Build Cards
    //////////////////////////////////////////////
    
     if (value.id === undefined) {
      currentDeleteButton = '';
      stars = '';
      addButton = `<a id="${value.imdbID}" href="#" class="btn addToListBtn btn-primary">Add to Watchlist</a>`;
    } else if (value.isWatched === true || value.id === null) {
      stars = '';
      currentDeleteButton = `<a data-delete-id="${value.id}" href="#" class="btn deleteBtn btn-primary">Forget This Flick</a>`;
      addButton = '';
    } else {
      currentDeleteButton = `<a data-delete-id="${value.id}" href="#" class="btn deleteBtn btn-primary">Remove from Watchlist</a>`;
      addButton = '';
    }
    /*any poster address that contains ia or had a value of N/A returned no img so i replaced with ODB*/
    if (value.Poster.indexOf("ia") > -1 || value.Poster === "N/A") {
      value.Poster = 'http://img2-ak.lst.fm/i/u/770x0/798712572d104cb39411b4ad986fc8cb.jpg';
    }


    cardsString += `<div id="movieCard--${index}" data--imdb-id="${value.imdbID}" class="col-md-3 col-md-offset-1 movieCard">
    <h2>${value.Title}</h2>
    <img class="moviePoster" src="${value.Poster}">${currentActors}
    <div class="btn">
        ${addButton}
        ${currentDeleteButton}
      </div>${stars}</div>`;

        //////////////////////////////////////////////
    //        Closing Div Logic
    //////////////////////////////////////////////

    if ((index + 1) % 3 === 0) {
      cardsString += `</div>`;
    } else if (index === movieData.length - 1) {
      cardsString += `</div>`;
    }
    outputString += cardsString;
    cardsString = '';
  });
  OUTPUT.append(outputString);

  //////////////////////////////////////////////
  //        Star Rating jQuery Theme
  //////////////////////////////////////////////
       $('.example').barrating('show', {
      theme: 'bootstrap-stars',
      onSelect: function(value, text,event) {
      console.log("event.target", this);
      favoriteMovie = event.target.closest('.movieCard').getAttribute("data--imdb-id");
      console.log("favoriteMovie",favoriteMovie);
      rating = value;
      console.log("rating", rating);
      array.push(favoriteMovie,rating);

      /*had to throw an error here to get rating event to work
      the star rating system was not very cooperative
      may be a better way just wanted to get functionality going*/
      throw new Error("stopping this shit");

        }
    });
}

module.exports = {cardBuilder, array};
