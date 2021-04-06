import React from "react";
import { Link, Route } from "react-router-dom";

import * as BooksAPI from "./BooksAPI";
import Shelf from "./Components/Shelf";
import Book from "./Components/Book";

import "./App.css";

class BooksApp extends React.Component {
  state = {
    books: null, // books retrieved with (token in local storage?)
    booksIds: null,
    query: "",
    queryResult: null,
  };

  // dict for creating shelfs
  shelfDict = {
    "Currently Reading": "currentlyReading",
    "Want to Read": "wantToRead",
    Read: "read", //  reserved word "Read"?
  };

  // update books state, called when init books & when move shelf
  updateBooks = function () {
    BooksAPI.getAll().then((books) => {
      this.setState({
        books: books,
      });
      let booksIds = [];
      for (let book in books) {
        booksIds.push(book.id);
      }
      this.setState({
        booksIds: booksIds,
      });
    });
  };

  // move shelf handler
  shelfChangeHandler = (id, shelf) => {
    BooksAPI.update({ id: id }, shelf).then(() => {
      this.updateBooks();
    });
  };

  render() {
    // init books
    !this.state.books && this.updateBooks();

    // create shelfs
    let shelfs = [];
    for (let shelfTitle in this.shelfDict) {
      shelfs.push(
        <Shelf
          shelfTitle={shelfTitle}
          _Shelf={this.shelfDict[shelfTitle]}
          key={this.shelfDict[shelfTitle]}
          books={this.state.books}
          shelfChangeHandler={this.shelfChangeHandler}
        />
      );
    }

    // create queryBooks
    let queryBooks = this.state.queryResult
      ? this.state.queryResult.map((book) => {
          let bookInShelf = this.state.books.find((myBook) => myBook.id === book.id);
          book.shelf = bookInShelf ? bookInShelf.shelf : null;
          return (
            <li key={book.id}>
              <Book book={book} shelfChangeHandler={this.shelfChangeHandler} />
            </li>
          );
        })
      : null;

    return (
      <div className="app">
        <Route
          exact
          path="/"
          render={() => (
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>{shelfs}</div>
              </div>
              <div className="open-search">
                <Link to="/search">
                  <button>Add a book</button>
                </Link>
              </div>
            </div>
          )}
        />
        <Route
          path="/search"
          render={() => (
            <div className="search-books">
              <div className="search-books-bar">
                <Link to="/">
                  <button className="close-search">Close</button>
                </Link>
                <div className="search-books-input-wrapper">
                  <input
                    type="text"
                    placeholder="Search by title or author"
                    value={this.state.query}
                    onChange={(event) => {
                      this.setState({
                        query: event.target.value,
                      });
                      BooksAPI.search(this.state.query).then((books) => {
                        books &&
                          !("error" in books) &&
                          this.setState({
                            queryResult: books,
                          });
                      });
                    }}
                  />
                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid">{this.state.query && queryBooks}</ol>
              </div>
            </div>
          )}
        />
      </div>
    );
  }
}

export default BooksApp;
