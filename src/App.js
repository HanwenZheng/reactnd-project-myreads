import React from "react";
import { Link, Route } from "react-router-dom";

import * as BooksAPI from "./BooksAPI";
import Home from "./views/Home";
import Shelf from "./Components/Shelf";
import Book from "./Components/Book";

import "./App.css";

class BooksApp extends React.Component {
  state = {
    books: null, // books retrieved with (token in local storage?)
    query: "", // search form value
    queryResult: null, // search result
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

    // create shelves
    let shelves = [];
    for (let shelfTitle in this.shelfDict) {
      shelves.push(
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
        <Route exact path="/" render={() => <Home shelves={shelves} />} />
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
                      this.setState({ query: event.target.value });
                      BooksAPI.search(this.state.query).then((books) => {
                        books && !("error" in books) && this.setState({ queryResult: books });
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
