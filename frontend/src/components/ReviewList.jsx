export default function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return <p>Nessuna recensione ancora. Sii il primo a lasciarne una!</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {reviews.map((review) => (
        <li
          key={review._id}
          style={{ background: "#f4f5f7", padding: "0.8rem", marginBottom: "0.6rem", borderRadius: 6 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{review.username}</strong>
            <span>{"⭐".repeat(review.rating)}</span>
          </div>
          <p style={{ margin: "0.4rem 0 0" }}>{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}