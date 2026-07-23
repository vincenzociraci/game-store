import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function Admin() {
  const [games, setGames] = useState([]);
  const [reviewsByGame, setReviewsByGame] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const gamesData = await api.getGames();
        setGames(gamesData);

        const reviewsEntries = await Promise.all(
          gamesData.map(async (game) => [game._id, await api.getReviews(game._id)])
        );
        setReviewsByGame(Object.fromEntries(reviewsEntries));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleDelete(gameId, reviewId) {
    await api.deleteReview(reviewId);
    setReviewsByGame((prev) => ({
      ...prev,
      [gameId]: prev[gameId].filter((r) => r._id !== reviewId),
    }));
  }

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p className="error-text">Errore: {error}</p>;

  return (
    <div>
      <h1>Amministrazione recensioni</h1>

      {games.map((game) => (
        <div key={game._id} className="admin-game-block">
          <h3>{game.title}</h3>

          {reviewsByGame[game._id]?.length === 0 ? (
            <p>Nessuna recensione</p>
          ) : (
            <ul className="review-list">
              {reviewsByGame[game._id]?.map((review) => (
                <li key={review._id} className="review-item">
                  <div className="review-header">
                    <strong>{review.username}</strong>
                    <span>{"⭐".repeat(review.rating)}</span>
                  </div>
                  <p>{review.comment}</p>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => handleDelete(game._id, review._id)}
                  >
                    Elimina
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}