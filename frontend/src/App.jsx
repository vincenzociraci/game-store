import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";

export default function App() {
  const { loading, isAuthenticated } = useAuth();
  const { items } = useCart();

  if (loading) return <p>Caricamento...</p>;

  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif" }}>
      <h1>GameStore — test iniziale</h1>
      <p>Autenticato: {isAuthenticated ? "sì" : "no"}</p>
      <p>Giochi nel carrello: {items.length}</p>
    </div>
  );
}