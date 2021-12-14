import View from './View.js';
import PreviewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it!`;
  _message = ``;

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  addHandlerBookmarksBtn(handler) {
    this._parentElement.parentElement.previousElementSibling.addEventListener(
      'click',
      () => {
        handler(this._parentElement.parentElement);
      }
    );
  }

  addHandlerCloseBookmarks(handler) {
    this._parentElement.parentElement.addEventListener('click', () => {
      handler(this._parentElement.parentElement);
    });
  }

  _generateMarkup() {
    return (
      this._data
        // render set to false, so that it will return a string which will be joined with .join method
        .map(bookmark => PreviewView.render(bookmark, false))
        .join('')
    );
  }
}

export default new BookmarksView();
