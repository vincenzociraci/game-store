import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";

export default function GameDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart, items } = useCart();

  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.getGame(id)
      .then(setGame)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    api.getReviews(id).then(setReviews).catch(() => setReviews([]));
  }, [id]);

  useEffect(() => {
    api.getGameStats(id).then(setStats).catch(() => setStats({ averageRating: 0, totalReviews: 0 }));
  }, [id]);

  async function handleAddReview(payload) {
    const newReview = await api.addReview(id, payload);
    setReviews((prev) => [newReview, ...prev]);
    api.getGameStats(id).then(setStats); // aggiorna anche la media, dato che è cambiata
  }

  async function handleDeleteReview(reviewId) {
    await api.deleteReview(reviewId);
    setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    api.getGameStats(id).then(setStats); // aggiorna anche la media
  }

  function handleAddToCart() {
    addToCart(game);
  }

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p className="error-text">Errore: {error}</p>;
  if (!game) return <p>Gioco non trovato</p>;

  const alreadyInCart = items.some((g) => g._id === game._id);

  return (
    <div>
      <div className="game-detail-header">
        <img src={game.cover} alt={game.title} />
        <div>
          <h1>{game.title}</h1>
          <p className="game-card-genre">{game.genere}</p>
          <p>
            Voto Medio: {stats.totalReviews > 0 ? stats.averageRating : "Nessun voto"}
          </p>
          <p>{game.description}</p>
          <p className="price-tag">Gratis</p>

          <button className="btn btn-primary" onClick={handleAddToCart} disabled={alreadyInCart}>
            {alreadyInCart ? "Nel carrello" : "Aggiungi al carrello"}
          </button>
        </div>
      </div>

      <hr />

      <h2>Recensioni</h2>
      <ReviewList reviews={reviews} onDelete={handleDeleteReview} />

      {isAuthenticated ? (
        <ReviewForm onSubmit={handleAddReview} />
      ) : (
        <p>Effettua il login per lasciare una recensione.</p>
      )}
    </div>
  );
}