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
  if (error) return <p style={{ color: "red" }}>Errore: {error}</p>;

  return (
    <div>
      <h1>Catalogo giochi</h1>
      <ul>
        {games.map((game) => (
          <li key={game._id} style={{ marginBottom: "0.5rem" }}>
            <Link to={`/games/${game._id}`}>
              <strong>{game.title}</strong> — {game.genre}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}