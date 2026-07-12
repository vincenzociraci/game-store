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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.getGame(id), api.getReviews(id)])
      .then(([gameData, reviewsData]) => {
        setGame(gameData);
        setReviews(reviewsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAddReview(payload) {
    const newReview = await api.addReview(id, payload);
    setReviews((prev) => [newReview, ...prev]);
  }

  async function handleDeleteReview(reviewId) {
    await api.deleteReview(reviewId);
    setReviews((prev) => prev.filter((r) => r._id !== reviewId));
  }

  function handleAddToCart() {
    addToCart(game);
  }

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p style={{ color: "red" }}>Errore: {error}</p>;
  if (!game) return <p>Gioco non trovato</p>;

  const alreadyInCart = items.some((g) => g._id === game._id);

  return (
    <div>
      <div style={{ display: "flex", gap: "2rem" }}>
        <img src={game.coverImage} alt={game.title} style={{ width: 220, borderRadius: 8 }} />
        <div>
          <h1>{game.title}</h1>
          <p>{game.genre}</p>
          <p>{game.description}</p>
          <p style={{ fontWeight: "bold", color: "green" }}>Gratis</p>

          <button onClick={handleAddToCart} disabled={alreadyInCart}>
            {alreadyInCart ? "Nel carrello" : "Aggiungi al carrello"}
          </button>
        </div>
      </div>

      <hr style={{ margin: "2rem 0" }} />

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