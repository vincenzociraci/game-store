import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const { items } = useCart();

  if (loading) return null;

  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem", background: "#2a3f5f", color: "white" }}>
      <Link to="/" style={{ color: "white" }}>
        <strong>GameStore</strong>
      </Link>
      <Link to="/cart" style={{ color: "white" }}>
        Carrello ({items.length})
      </Link>

      {isAdmin && (
        <Link to="/admin" style={{ color: "white" }}>
          Amministrazione
        </Link>
      )}

      {isAuthenticated ? (
        <>
          <span>Ciao, {user.username}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: "white" }}>
            Login
          </Link>
          <Link to="/register" style={{ color: "white" }}>
            Registrati
          </Link>
        </>
      )}
    </nav>
  );
}