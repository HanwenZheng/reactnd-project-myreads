import React from "react";

import Book from "./Book";

class Shelf extends React.Component {
  render() {
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.shelfTitle}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {this.props.books &&
              this.props.books
                .filter((book) => book.shelf === this.props._Shelf)
                .map((book) => (
                  <li key={book.id}>
                    <Book
                      book={book}
                      shelfChangeHandler={this.props.shelfChangeHandler}
                    />
                  </li>
                ))}
          </ol>
        </div>
      </div>
    );
  }
}

export default Shelf;
