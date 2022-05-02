import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Bookshelf from './components/bookshelf/Bookshelf';
import Search from './components/search/Search';
import * as BooksAPI from './BooksAPI';

import './app.scss';

function App() {
  const [bookShelf, setBookShelf] = useState([]);

  const fetchBooks = async () => {
    try {
      const books = await BooksAPI.getAll();
      return books;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      fetchBooks().then((books) => {
        const currentlyReading = books.filter(
          (book) => book.shelf === 'currentlyReading'
        );
        const wantToRead = books.filter((book) => book.shelf === 'wantToRead');
        const read = books.filter((book) => book.shelf === 'read');

        setBookShelf([
          { title: 'Currently Reading', books: currentlyReading },
          { title: 'Want to Read', books: wantToRead },
          { title: 'Read', books: read },
        ]);
      });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const onShelfChange = async (book, category) => {
    try {
      const response = await BooksAPI.update(book, category);
      const { currentlyReading, wantToRead, read } = response;

      const books = await Promise.all([
        ...currentlyReading.map((id) => BooksAPI.get(id)),
        ...wantToRead.map((id) => BooksAPI.get(id)),
        ...read.map((id) => BooksAPI.get(id)),
      ]);

      setBookShelf([
        {
          title: 'Currently Reading',
          books: books.filter((book) => book.shelf === 'currentlyReading'),
        },
        {
          title: 'Want to Read',
          books: books.filter((book) => book.shelf === 'wantToRead'),
        },
        { title: 'Read', books: books.filter((book) => book.shelf === 'read') },
      ]);
    } catch (e) {}
  };

  return (
    <div className="app">
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Bookshelf
              title="MyReads"
              bookShelf={bookShelf}
              onShelfChange={onShelfChange}
            />
          }
        />
        <Route
          path="/search"
          element={
            <Search
              currentCollection={bookShelf}
              onShelfChange={onShelfChange}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
