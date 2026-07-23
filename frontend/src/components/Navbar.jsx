import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const { items } = useCart();

  if (loading) return null;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        GameStore
      </Link>
      <Link to="/cart">Carrello ({items.length})</Link>

      {isAdmin && <Link to="/admin">Amministrazione</Link>}

      {isAuthenticated ? (
        <>
          <span className="navbar-user">Ciao, {user.username}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Registrati</Link>
        </>
      )}
    </nav>
  );
}