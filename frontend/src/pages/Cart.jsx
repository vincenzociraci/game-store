//questo componente gestisce la visualizzazione dei giochi nel carrello. Oltre a interfacciarsi con il CartContext per
//leggere e svuotare il carrello locale, si occupa di preparare e formattare i dati prima di inviarli al backend.

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
// Se non sei loggato, non ha senso nemmeno provare la chiamata:
// la reindirizziamo subito al login.
navigate("/login");
return;
}
//Il frontend salva l'intero oggetto del gioco (con titolo, immagine e genere) nel localStorage perché 
//gli serve per disegnare l'interfaccia. Tuttavia il backend deve ricevere un array ID per registrare l'ordine
//quindi restiutuamo con il metodo .map un nuovo array di soli ID
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
{/* è fondamentale che la funzione deve essere resitutita tramite una arrow function in modo che
    non esegua la rimozione di un game id al rendering della pagina */}
</li>
))}
</ul>
<button onClick={handleCheckout}>Completa l'ordine</button>
</>
)}
</div>
);
}