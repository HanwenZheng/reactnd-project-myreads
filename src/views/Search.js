import React from "react";
import { Link } from "react-router-dom";
import * as BooksAPI from "../BooksAPI";

const Search = (props) => {
  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link to="/">
          <button className="close-search">Close</button>
        </Link>
        <div className="search-books-input-wrapper">
          <input
            autoFocus="true"
            type="text"
            placeholder="Search by title or author"
            value={props.state.query}
            onChange={(event) => {
              props.updateStateHandler({ query: event.target.value });
              BooksAPI.search(props.state.query).then((books) => {
                books && !("error" in books) && props.updateStateHandler({ queryResult: books });
              });
            }}
          />
        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">{props.state.query && props.queryBooks}</ol>
      </div>
    </div>
  );
};

export default Search;
