import { useState } from "react";

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!comment.trim()) {
      setError("Il commento non può essere vuoto");
      return;
    }

    try {
      await onSubmit({ rating: Number(rating), comment });
      setComment("");
      setRating(5);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h4>Lascia una recensione</h4>

      {error && <p className="error-text">{error}</p>}

      <label>
        Voto
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} {"⭐".repeat(n)}
            </option>
          ))}
        </select>
      </label>

      <label>
        Commento
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Cosa ne pensi di questo gioco?"
        />
      </label>

      <button type="submit" className="btn btn-primary">
        Invia recensione
      </button>
    </form>
  );
}