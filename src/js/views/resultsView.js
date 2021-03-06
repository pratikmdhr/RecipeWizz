import View from './View.js';
import PreviewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found for your query! Please try again!`;
  _message = ``;

  hideForMobile() {
    this._parentElement.parentElement.classList.add('search-results__hide');
  }
  showForMobile() {
    this._parentElement.parentElement.classList.remove('search-results__hide');
  }

  _generateMarkup() {
    // render set to false, so that it will return a string which will be joined with .join method
    return this._data.map(result => PreviewView.render(result, false)).join('');
  }
}

export default new ResultsView();
