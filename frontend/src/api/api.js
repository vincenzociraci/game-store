//Questo modulo centralizza ogni comunicazione con il backend, evitando di disperdere chiamate fetch in ogni componente. La funzione
//interna request(path, options) effettua concretamente la chiamata HTTP

//Definizione dell'Endpoint e aggiunta di un port di fallback in caso di mancata configurazione
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

//funzione principale per le richieste http, automatizza la configurazione di ogni chiamata
//"credentials: include" è cruciale per ordinare al server di mantenere i cookie httpOnly (che contengono il token JWT) ad ogni singola
//richiesta del client, garantendo trasparenza e sicurezza. Senza di questa l'autenticazione al lato client fallirebbe al refresh della pagina
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {    //concatena url base col percorso
    credentials: "include",    //invia sempre i cookie del dominio del backend insieme a questa richiesta (cors)
    headers: {
      "Content-Type": "application/json",   //uso json di default ma chi chiama request può
      ...(options.headers || {}),           //aggiungere altri header
    },
    ...options,
  });
//dato che il supporto nativo del broswer non invia mai degli status di errore HTTP, creiamo un costrutto if che analizza il flag
//res.ok e lancia un Errore nel caso in cui questa res non corrisponda a quelle comprese tra 200 e 299. Così facendo abbiamo una gestione
//automatizzata degli errori di rete. La prima riga in cui viene restituito un data vuoto è per quando il parsing JSON fallisce
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Si è verificato un errore");
  }

  return data;
}
//mappatura di tutti gli endpoint del backend che verranno restituiti ed esportati tramite una costante api. In questo modo abbiamo
//un pacchetto completo di tutte le richieste da parte del client dei vari endpoint.
export const api = {
  // Giochi
  getGames: () => request("/games"),
  getGame: (id) => request(`/games/${id}`),
 getGameStats: (id) => request(`/games/${id}/stats`), 
 
  // Autenticazione
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),

  // Recensioni
  getReviews: (gameId) => request(`/games/${gameId}/reviews`),
  addReview: (gameId, payload) =>
    request(`/games/${gameId}/reviews`, { method: "POST", body: JSON.stringify(payload) }),
  deleteReview: (reviewId) => request(`/reviews/${reviewId}`, { method: "DELETE" }),

  // Ordini
  checkout: (gameIds) => request("/orders", { method: "POST", body: JSON.stringify({ gameIds }) }),
};