import { useState, useEffect, use } from 'react'
import './App.css'
import Search from './components/Search.jsx'

const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMovies = async() => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = `${BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'No movies found');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
    } catch(error){
      console.error('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, []);
  return (
    <main>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="hero-banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section classname="all-movies">
            <h2 className="mt-[40px]">Popular Movies</h2>
            {isLoading ? (
              <p className="loading">Loading...</p>
            ) : errorMessage ? (
              <p className="error">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <p className="text-white">{movie.title}</p>
                ))}
              </ul>
            )}
        </section>
      </div>
      
    </main>
  )
}

export default App
