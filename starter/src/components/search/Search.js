import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Book from '../book/Book';
import * as BooksAPI from '../../BooksAPI';

import './search.scss';
import { debounce } from 'lodash';
const Search = ({ currentCollection, onShelfChange }) => {
  const [searchResults, setSearchResults] = useState([]);

  const debouncedChangeHandler = useMemo(() => {
    return debounce((query) => {
      if (query.length < 1) {
        setSearchResults([]);
        return;
      }

      const getBooks = async () => {
        try {
          const books = await BooksAPI.search(query);

          if (books.error) {
            setSearchResults([]);
            return;
          }

          Promise.all(books).then((books) => {
            if (currentCollection.length > 0 && !books.error) {
              const booksOnShelf = currentCollection.reduce(
                (collection, current) => [...collection, ...current.books],
                []
              );

              const filteredBooks = books
                .filter((book) => book.imageLinks !== undefined)
                .filter((book) => book.authors !== undefined)
                .map(
                  (book) => booksOnShelf.find((b) => b.id === book.id) || book
                );

              setSearchResults(filteredBooks);
            } else {
              setSearchResults(books);
            }
          });
        } catch (e) {
          console.log(e);
        }
      };

      getBooks();
    }, 300);
  }, [currentCollection]);

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  });

  const renderSearchResults = () => {
    if (searchResults.length < 1) {
      return (
        <div className="search-results">
          <p>No results found</p>
        </div>
      );
    }

    return searchResults.map((book, index) => (
      <li key={index}>
        <Book book={book} onShelfChange={onShelfChange} />
      </li>
    ));
  };

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link to="/" className="close-search">
          Close
        </Link>
        <div className="search-books-input-wrapper">
          <input
            onChange={(e) => debouncedChangeHandler(e.target.value)}
            type="text"
            placeholder="Search by title, author, or ISBN"
          />
        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">{renderSearchResults()}</ol>
      </div>
    </div>
  );
};

export default Search;
