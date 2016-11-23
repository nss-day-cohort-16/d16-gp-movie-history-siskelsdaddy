"use strict";

const OUTPUT = $("#movieOutput");

let cards = {};
cards.cardBuilder = (movieObj) => {

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
  // let movieArray = movieData.Search;


///////////     selection view filter pseudo logic

  // if (show untracked is selected) {
  //  filter down to only OMDB results that are not included in firebase
  //} else if (show unwatched is selected) {
  //  filter array to only movies with isWatched = false;
  // } else if (show watched is selected) {
  //  filter array to only movies with isWatched = true;
  // } else if (show favorites is selected) {
  //  filter results to only movies with a 10 star rating
  // }
  //THEN the array will continue onto the cardbuilder as usual

//////////////////

  let currentActors,
  currentDeleteButton,
  addButton;
  movieData.forEach((value, index) => {
    if (value.Actors === undefined) {
      currentActors = '';
    } else {
      currentActors = `<p>Actors: ${value.Actors}</p>`;
    }


    if (value.id === undefined) {
      currentDeleteButton = '';
      addButton = `<a id="${value.imdbID}" href="#" class="btn addToListBtn btn-primary">Add to Watchlist</a>`;
    } else {
      currentDeleteButton = `<a data-delete-id="${value.id}" href="#" class="btn deleteBtn btn-primary">Remove from Watchlist</a>`;
      addButton = '';
    }

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
    if (value.id === null){
      stars = '';
      currentDeleteButton = '';
      addButton = '';
    }

    cardsString += `<div id="movieCard--${index}" data--imdb-id="${value.imdbID}" class="col-md-3 col-md-offset-1 movieCard">
    <h2>${value.Title}</h2>
    <img class="moviePoster" src="${value.Poster}">${currentActors}
    <div class="btn-group btn-group-justified">
        ${addButton}
        ${currentDeleteButton}
      </div>${stars}</div>`;

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
      theme: 'bootstrap-stars'
    });
};

module.exports = cards;
