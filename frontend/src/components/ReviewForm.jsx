//in questo file avviene la compilazione di un form per le recensioni. La particolarità di questo file è che
//delega l'intera logica di comunicazione di rete al suo componente genitore.


import { useState } from "react";

//non viene importato api.js, quindi il form non sa a quale gioco sarà correlato. Questa scelta è stata fatta per rendere 
//più flessibile la compilazione form: riceve una funzione come parametro prop e si limita a passargli i dati. 
//una volta cliccato il submit, sarà la pegina genitore GameDetail.jsx a determinare a quale gioco si riferisce la recensione
export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();  //preveniamo la pagina dal ricaricarsi, perchè altrimenti comporterebbe alla perdita di dati che erano stati salvati nella sessione precedente
    setError("");

//inoltre per evitare che l'utente invii solo uno spazio vuoto nella recensione andiamo a prevenire questa cosa con il 
//metodo .trim, che andrà lui stesso ad eleiminare tutti gli spazi bianchi
    if (!comment.trim()) {
      setError("Il commento non può essere vuoto");
      return;
    }

    try {
      await onSubmit({ rating: Number(rating), comment }); //poichè Mongoose ha regole severe e si aspetta un valore numerico, effettuiamo un casting esplicito sul rating
      setComment(""); // svuotiamo il form dopo l'invio riuscito
      setRating(5);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, marginTop: "1rem" }}>
      <h3>Lascia una recensione</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "0.8rem" }}>
        <label>Voto</label>
        <br />
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} {"⭐".repeat(n)}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "0.8rem" }}>
        <label>Commento</label>
        <br />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          style={{ width: "100%" }}
        />
      </div>

      <button type="submit">Invia recensione</button>
    </form>
  );
}