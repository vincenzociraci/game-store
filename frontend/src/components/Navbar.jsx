//barra di navigazione che mostra lo stato in tempo reale dell'utente e del carrello senza ricevere alcuna prop
//dai componenti superiori

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

//utlizzo di custom hook (useAuth() e useCart()) per tenere la navbar al corrente dello stato attuale degli elementi di essa
//in modo che sia pronta a subire cambiamenti di stato, come ad esempio l'aggiornamento del numero di giochi nel carrello
export default function Navbar() {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const { items } = useCart();

  if (loading) return null;    //previene lo "sfarfallio" e migliora la user experience evitando piccoli microsecondi in cui
                          //nella navbar ci siano ancora degli stati precedenti che ormai non sono conformi alla situazione attuale

  
//struttura html della navbar
                          return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem", background: "#2a3f5f", color: "white" }}>
      <Link to="/" style={{ color: "white" }}>  {/* usiamo link invece di href perchè altrimenti <a> forzerebbe il browser ad effetturare una nuova richiesta */}
        <strong>GameStore</strong>
      </Link>
      <Link to="/cart" style={{ color: "white" }}>
        Carrello ({items.length})
      </Link>
{/* Il link admin compare solo se l'utente loggato ha ruolo admin */}
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