import 'regenerator-runtime/runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  // const { recipe } = data.data;
  return {
    id: data.id,
    title: data.title,
    publisher: data.sourceName,
    sourceUrl: data.sourceUrl,
    image: data.image,
    servings: data.servings,
    cookingTime: data.readyInMinutes,
    ingredients: data.extendedIngredients,
    ...(data.key && { key: data.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}/information?apiKey=${KEY}`);
    // console.log(data);
    state.recipe = createRecipeObject(data);
    // console.log(state.recipe);
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (err) {
    console.log(`${err}🎈🎈`);
    throw `${err}🎈🎈`;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(
      API_URL +
        `complexSearch?apiKey=${KEY}&query=${query}&number=30&addRecipeNutrition=true`
    );
    state.search.results = data.results.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.sourceName,
        image: rec.image,
        // ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.log(`${err}🎈🎈`);
    throw `${err}🎈🎈`;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.amount = ((ing.amount * newServings) / state.recipe.servings).toFixed(
      2
    );
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  // Delete bookmark
  state.bookmarks.splice(index, 1);

  // Mark current recipe as Not bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
