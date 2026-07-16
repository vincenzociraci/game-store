//questa sezione si occupa della pagina delle recensioni e riesce a riconoscere altreattanto se l'utente che sta utilizzando
//la pagina è un admin oppure un utente normale
import { useAuth } from "../context/AuthContext";

export default function ReviewList({ reviews, onDelete }) {
  const { isAdmin } = useAuth(); //utlizzo dell'hook useAuth() per leggere direttamente dal Context globale l'informazione isAdmin

  if (reviews.length === 0) {
    return <p>Nessuna recensione ancora. Sii il primo a lasciarne una!</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {reviews.map((review) => (
        <li
          key={review._id}
          style={{ background: "#f4f5f7", padding: "0.8rem", marginBottom: "0.6rem", borderRadius: 6 }}
        >     {/*L'utliizzo di key invece di <index> serve per comodità a React, permettendogli di leggere senza problemi quale elemento della lista è stato
        aggiunto senza creare dei bug visivi nel caso in cui gli elementi dell'array dovessero cambiare */}   
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{review.username}</strong>
            <span>{"⭐".repeat(review.rating)}</span>
          </div>
          <p style={{ margin: "0.4rem 0 0" }}>{review.comment}</p>
{/* Il pulsante di eliminazione compare solo se l'utente loggato è admin
        E solo se il componente genitore ha effettivamente fornito onDelete */}
          {isAdmin && onDelete && (
            <button onClick={() => onDelete(review._id)} style={{ color: "red" }}>
              Elimina recensione
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}