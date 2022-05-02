import { Link } from 'react-router-dom';
import './bookshelf.scss';

import Shelf from './Shelf';

const Bookshelf = ({ title, bookShelf, onShelfChange }) => {
  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>{title}</h1>
      </div>
      <div className="list-books-content">
        <div>
          {bookShelf.map((shelf, index) => (
            <Shelf
              key={index}
              title={shelf.title}
              books={shelf.books}
              onShelfChange={onShelfChange}
            />
          ))}
        </div>
      </div>
      <div className="open-search">
        <Link to="/search">Add a book</Link>
      </div>
    </div>
  );
};

export default Bookshelf;
