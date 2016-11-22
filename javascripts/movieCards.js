"use strict";

const OUTPUT = $("#movieOutput");

let cards = {};
cards.cardBuilder = (movieData) => {
  OUTPUT.html('');
  let cardsString = '',
    outputString = '';
  // let movieArray = movieData.Search;

  if (Array.isArray(movieData)) {
    // console.log("movieData is an array");
  } else {
    movieData = [movieData];
    // console.log("movieData is not an array");
  }
  // console.log("movieArray", movieArray);
  let currentActors;
  movieData.forEach((value, index) => {
    if (value.Actors === undefined) {
      currentActors = '';
    } else {
      currentActors = `<p>Actors: ${value.Actors}</p>`;
    }
    // console.log("value", value);
    // console.log("index", index);
    if (index % 3 === 0) {
      cardsString = `<div class="row">`;
    }
    //////////////////////////////////////////////
    //        Star rating variable
    //////////////////////////////////////////////
    let stars = '<div class="br-wrapper br-theme-fontawesome-stars"><select class="example"><option value=""></option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></div>';

    //////////////////////////////////////////////
    //        Build Cards
    //////////////////////////////////////////////
    cardsString += `<div id="m
ovieCard--${index}" data--imdb-id="${value.imdbID}" class="col-md-4 movieCard">
    <h2>${value.Title}</h2>
    <img class="moviePoster" src="${value.Poster}">${currentActors}
    <div class="btn-group btn-group-justified">
        <a id="${value.imdbID}" href="#" class="btn addToListBtn btn-primary">Add to Watchlist</a>
      </div>${stars}</div>`;

    if ((index + 1) % 3 === 0) {
      cardsString += `</div>`;
    } else if (index === movieData.length - 1) {
      cardsString += `</div>`;
    }
    outputString += cardsString;

    cardsString = '';
    console.log("cardsString", cardsString);
  });
  OUTPUT.append(outputString);

  //////////////////////////////////////////////
  //        Star Rating jQuery Theme
  //////////////////////////////////////////////
  $('.example').barrating('show', {
    theme: 'bootstrap-stars'
  });
};

module.exports = cards;
