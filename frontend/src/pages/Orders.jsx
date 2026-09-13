import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getMyOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Caricamento della tua libreria...</p>;
  if (error) return <p className="error-text">Errore: {error}</p>;

  if (orders.length === 0) {
    return (
      <div>
        <h1>La tua libreria</h1>
        <p>
          Non hai ancora nessun gioco. <Link to="/">Sfoglia il catalogo</Link> per
          iniziare.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>La tua libreria</h1>
      {orders.map((order) => (
        <div key={order._id} className="order-block">
          <p className="order-date">
            Ordine del{" "}
            {new Date(order.createdAt).toLocaleDateString("it-IT", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <ul className="order-games">
            {order.games.map((game) => (
              <li key={game._id} className="order-game-item">
                <img src={game.cover} alt={game.title} />
                <div>
                  <Link to={`/games/${game._id}`}>
                    <strong>{game.title}</strong>
                  </Link>
                  <p className="game-card-genre">{game.genere}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
