import './book.scss';

const Book = ({ book, onShelfChange }) => {
  const { title, authors, imageLinks } = book;
  const thumbnail = imageLinks ? imageLinks.thumbnail : '';

  return (
    <div className="book">
      <div className="book-top">
        <div
          className="book-cover"
          style={{
            width: 128,
            height: 193,
            backgroundImage: `url("${thumbnail}")`,
          }}
        ></div>
        <div className="book-shelf-changer">
          <select
            value={book.shelf || 'none'}
            onChange={(e) => onShelfChange(book, e.target.value)}
          >
            <option value="move" disabled>
              Move to ...
            </option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
      <div className="book-title">{title}</div>
      <div className="book-authors">{authors && authors.join(', ')}</div>
    </div>
  );
};

export default Book;
