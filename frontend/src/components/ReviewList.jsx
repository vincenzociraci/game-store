import { useAuth } from "../context/AuthContext";

export default function ReviewList({ reviews, onDelete }) {
  const { isAdmin } = useAuth();

  if (reviews.length === 0) {
    return <p>Nessuna recensione ancora. Sii il primo a lasciarne una!</p>;
  }

  return (
    <ul className="review-list">
      {reviews.map((review) => (
        <li key={review._id} className="review-item">
          <div className="review-header">
            <strong>{review.username}</strong>
            <span>{"⭐".repeat(review.rating)}</span>
          </div>
          <p>{review.comment}</p>

          {isAdmin && onDelete && (
            <button className="btn btn-danger btn-small" onClick={() => onDelete(review._id)}>
              Elimina recensione
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}