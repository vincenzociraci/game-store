import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";

export default function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getGames()
      .then(setGames)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Caricamento catalogo...</p>;
  if (error) return <p className="error-text">Errore: {error}</p>;

  return (
    <div>
      <ul className="game-grid">
  {games.map((game) => (
    <li
      key={game._id}
      className="game-card"
      style={{ backgroundImage: `url(${game.cover})` }}
    >
      <Link to={`/games/${game._id}`} className="game-card-overlay">
        <strong>{game.title}</strong>
        <p className="game-card-genre">{game.genere}</p>
      </Link>
    </li>
  ))}
</ul>
    </div>
  );
}