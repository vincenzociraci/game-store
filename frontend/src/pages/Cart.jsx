import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";

export default function Cart() {
  const { items, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleCheckout() {
    setError("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const gameIds = items.map((g) => g._id);
      await api.checkout(gameIds);
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  }

  if (success) {
    return (
      <div>
        <h1>Grazie per il tuo ordine!</h1>
        <p>I giochi sono stati aggiunti alla tua libreria.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Il tuo carrello</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {items.length === 0 ? (
        <p>Il carrello è vuoto.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {items.map((game) => (
              <li
                key={game._id}
                style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.6rem" }}
              >
                <img src={game.coverImage} alt={game.title} style={{ width: 50, height: 50 }} />
                <span style={{ flex: 1 }}>{game.title}</span>
                <span style={{ color: "green" }}>Gratis</span>
                <button onClick={() => removeFromCart(game._id)}>Rimuovi</button>
              </li>
            ))}
          </ul>

          <button onClick={handleCheckout}>Completa l'ordine</button>
        </>
      )}
    </div>
  );
}