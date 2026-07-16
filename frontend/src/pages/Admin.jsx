//componente più complicata per quatno riguarda alla gestione degli stati lato frontend.
//Il suo compito è caricare l'intero catalogo dei giochi, prelevare parallelamente le recensioni 
//di ciascuno e permettere l'eliminazione mirata, aggiornando un'architettura di dati annidata

import { useEffect, useState } from "react";
import { api } from "../api/api";
/**
* Pannello admin: carica tutti i giochi e, per ciascuno, le sue recensioni,
* mostrando un pulsante per eliminarle.
*/
export default function Admin() {
const [games, setGames] = useState([]);
const [reviewsByGame, setReviewsByGame] = useState({});
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

//Nota bene: la funzione di callback principale di un useEffect non può mai essere dichiarata come async. 
//React si aspetta che restituisca una funzione di cleanup (o niente), non una Promise. Per aggirare questo limite 
//e usare comodamente await, abbiamo definito una funzione asincrona interna (loadData) e l'abbiamo invocata immediatamente dopo
useEffect(() => {
async function loadData() {
try {
const gamesData = await api.getGames();
setGames(gamesData);
// Per ogni gioco, carichiamo le sue recensioni in parallelo
const reviewsEntries = await Promise.all(
gamesData.map(async (game) => [game._id, await api.getReviews(game._id)])
);
// Trasformiamo l'array di coppie [gameId, reviews] in un oggetto
// { gameId1: [...], gameId2: [...] }, più comodo da consultare per id.
setReviewsByGame(Object.fromEntries(reviewsEntries));
} catch (err) {
setError(err.message);
} finally {
setLoading(false);
}
}
loadData();
}, []);
async function handleDelete(gameId, reviewId) {
await api.deleteReview(reviewId);
setReviewsByGame((prev) => ({
...prev,
[gameId]: prev[gameId].filter((r) => r._id !== reviewId),
}));
}
if (loading) return <p>Caricamento...</p>;
if (error) return <p style={{ color: "red" }}>Errore: {error}</p>;

return (
<div>
<h1>Amministrazione recensioni</h1>
{games.map((game) => (
<div key={game._id} style={{ marginBottom: "2rem" }}>
<h3>{game.title}</h3>
{reviewsByGame[game._id]?.length === 0 ? (
<p>Nessuna recensione</p>
) : (
<ul style={{ listStyle: "none", padding: 0 }}>
{reviewsByGame[game._id]?.map((review) => (
<li
key={review._id}
style={{ background: "#f4f5f7", padding: "0.8rem", marginBottom: "0.6rem", borderRadius: 6 }}
>
<div style={{ display: "flex", justifyContent: "space-between" }}>
<strong>{review.username}</strong>
<span>{"⭐".repeat(review.rating)}</span>
</div>
<p style={{ margin: "0.4rem 0" }}>{review.comment}</p>
<button onClick={() => handleDelete(game._id, review._id)} style={{ color: "red" }}>
Elimina
</button>
</li>
))}
</ul>
)}
</div>
))}
</div>
);
}