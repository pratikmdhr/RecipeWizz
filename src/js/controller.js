import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlMobileRouteToResults = () => {
  recipeView.hideForMobile();
  resultsView.showForMobile();
};

const controlMobileRouteToRecipe = () => {
  recipeView.showForMobile();
  resultsView.hideForMobile();
};

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0. Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1. Loading the recipe from API
    await model.loadRecipe(id);

    // 2. Rendering
    recipeView.render(model.state.recipe);
    controlMobileRouteToRecipe();
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Load search results
    await model.loadSearchResults(query);

    // Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // Render initial pagination button
    paginationView.render(model.state.search);
    controlMobileRouteToResults();
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Render New Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add or remove bookmark
  // console.log(model.state.recipe);
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlToggleBookmarksView = function (el) {
  el.classList.toggle('bookmarks__show');
};
const controlCloseBookmarksView = function (el) {
  el.classList.remove('bookmarks__show');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  bookmarksView.addHandlerCloseBookmarks(controlCloseBookmarksView);
  bookmarksView.addHandlerBookmarksBtn(controlToggleBookmarksView);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.backButtonHandler(controlMobileRouteToResults);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
