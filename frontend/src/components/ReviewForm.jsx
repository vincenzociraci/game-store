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