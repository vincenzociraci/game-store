//se non presente nell'.env usa 5000
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

//options è un valore di default, se chiamo request("games") senza secondo argomento
//options rimane vuoto e non undefined
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {    //concatena url base col percorso
    credentials: "include",    //invia sempre i cookie del dominio del backend insieme a questa richiesta (cors)
    headers: {
      "Content-Type": "application/json",   //uso json di default ma chi chiama request può
      ...(options.headers || {}),           //aggiungere altri header
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Si è verificato un errore");
  }

  return data;
}

export const api = {
  // Giochi
  getGames: () => request("/games"),
  getGame: (id) => request(`/games/${id}`),

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