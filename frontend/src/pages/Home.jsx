import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";

export default function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    api
      .getGames()
      .then(setGames)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Valori derivati: ricalcolati ad ogni render, non salvati in stato separato

  // Elenco dei generi presenti nel catalogo (senza duplicati, ordinati)
  const genres = [...new Set(games.map((g) => g.genere).filter(Boolean))].sort();

  // Catalogo filtrato per testo e per genere
  const filteredGames = games.filter((game) => {
    const matchesQuery = game.title
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesGenre = selectedGenre === "" || game.genere === selectedGenre;
    return matchesQuery && matchesGenre;
  });

  if (loading) return <p>Caricamento catalogo...</p>;
  if (error) return <p className="error-text">Errore: {error}</p>;

  return (
    <div>
      <h1>Catalogo giochi</h1>

      <div className="catalog-filters">
        <input
          type="text"
          className="catalog-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca un gioco per titolo..."
        />
        <select
          className="catalog-genre"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">Tutti i generi</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {filteredGames.length === 0 ? (
        <p>Nessun gioco corrisponde alla ricerca.</p>
      ) : (
        <ul className="game-grid">
          {filteredGames.map((game) => (
            <li
              key={game._id}
              className="game-card"
              style={{ backgroundImage: `url("${game.cover}")` }}
            >
              <Link to={`/games/${game._id}`} className="game-card-overlay">
                <strong>{game.title}</strong>
                <p className="game-card-genre">{game.genere}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
