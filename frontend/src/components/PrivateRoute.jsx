//file che intercetta la navigazione prima di mostrare una pagina e decide se l'utente ha i permessi per vederla.
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
/**
* Avvolge una rotta e ne blocca l'accesso se le condizioni non sono rispettate:
* - se l'utente non è autenticato, viene rimandato al login
* - se adminOnly è true e l'utente non è admin, viene rimandato alla home
*
* Uso: <PrivateRoute adminOnly><Admin /></PrivateRoute>
*/

export default function PrivateRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
// Finché non sappiamo ancora se l'utente è loggato (primo controllo in corso),
// non decidiamo nulla: evitiamo così un redirect "sbagliato" e temporaneo.

//Il primo controllo è sul loading e serve a evitare i 'falsi positivi'. Quando apriamo l'app, per una frazione di secondo 
//non sappiamo ancora se l'utente ha una sessione attiva. Se non bloccassimo l'esecuzione qui, un utente legittimo verrebbe 
//reindirizzato per sbaglio al login prima che il Context faccia in tempo a validare il suo cookie
  if (loading) return <p>Caricamento...</p>;
//procedure che verificano se tu sei autenticato o meno, se non sei autenticato vieni reindirizzato al login, mentre se
//non se la rotta chiede i privilegi di amministrazione e tu non li hai vieni spedito direttamente alla Home 
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return children;  //se tutto è in regola restituisce la sezione figlio che era incapsulata all'interno del PrivateRoute di app.jsx
}