import React from "react";

class Book extends React.Component {
  render() {
    return (
      <div className="book">
        <div className="book-top">
          <div
            className="book-cover"
            style={{
              width: 128,
              height: 193,
              // is there a better way of order-using things if previous not available (like in css fonts)?
              backgroundImage: `url(${
                this.props.book.imageLinks
                  ? this.props.book.imageLinks.thumbnail
                  : this.props.book.previewLink
                  ? this.props.book.previewLink
                  : null
              })`,
              backgroundSize: "128px 193px",
            }}
          />
          <div className="book-shelf-changer">
            <select
              value={this.props.book.shelf ? this.props.book.shelf : "none"}
              onChange={(event) => {
                this.props.shelfChangeHandler(
                  this.props.book.id,
                  event.target.value
                );
              }}
            >
              <option value="move" disabled>
                Move to...
              </option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">{this.props.book.title}</div>
        <div className="book-authors">
          {this.props.book.authors ? this.props.book.authors.join(", ") : null}
        </div>
      </div>
    );
  }
}

export default Book;
