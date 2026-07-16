//schermata principale del sito dove compare il catalogo completo dei giochi.
//Inoltre questo è il componente classico che effettua il recupero dei dati asincrono non appena viene renderizzato a schermo 
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
export default function Home() {
const [games, setGames] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

//per caricare i dati utilizziamo useEffect esguito da un array di dipendenze vuoto. Questo pattern serve a React per effettuare 
//la chiamata al backend (api.getGames()) una sola volta all'avvio del componente
useEffect(() => {
api
.getGames()
.then(setGames)
.catch((err) => setError(err.message))
.finally(() => setLoading(false));
}, []); //senza l'array vuoto il server verrebbe tempestato di richieste ad ogni re-render e manderebbe in crash il sito.
if (loading) return <p>Caricamento catalogo...</p>;
if (error) return <p style={{ color: "red" }}>Errore: {error}</p>;
//qui sopra avviene la gestione dei tre stati della pagina (loading, error e games). Invece di creare un blocco complesso di if/else nel
//costrutto JSX gestiamo la situazione tramite dei return anticipati, quindi ad esempio se stiamo caricando la pagina il componente
//restituisce l'interfaccia di blocco e si ferma.
return (
<div>
<h1>Catalogo giochi</h1>
<ul>
{games.map((game) => (
<li key={game._id} style={{ marginBottom: "0.5rem" }}>
<Link to={`/games/${game._id}`}>
{/*Generazione dei link di ogni gioco che sono caratterizzati univocamente dal loro id all'interno dell'URL.
   Questo combacia perfettamente con la rotta parametrica definita in App.jsx*/}
<strong>{game.title}</strong> — {game.genre}
</Link>
</li>
))}
</ul>
</div>
);
}