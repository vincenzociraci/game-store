//Il contenuto di questo file ha quasi la stessa identica dinamica del file Login.jsx, con l'unica differenza che
//che sarà la prima volta che verranno registrate delle nuove credenziali da parte dell'utente

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Register() {
const { register } = useAuth();
const navigate = useNavigate();
const [username, setUsername] = useState("");  //rispetto al login registriamo un campo di stato aggiuntivo per lo username
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
async function handleSubmit(e) {
e.preventDefault();
setError("");
try {
await register(username, email, password);    //raccogliamo e passiamo i tre parametri alla funzione asincrona register
                                              //in attesa che il Database prelevi queste credenziali e restituisca il cookie di sessione all' utente
navigate("/");
} catch (err) {
setError(err.message);
}
}
return (
<div style={{ maxWidth: 320 }}>
<h1>Registrati</h1>
{error && <p style={{ color: "red" }}>{error}</p>}
<form onSubmit={handleSubmit}>
<div style={{ marginBottom: "0.8rem" }}>
<label>Username</label>
<br />
<input value={username} onChange={(e) => setUsername(e.target.value)} required />
</div>
<div style={{ marginBottom: "0.8rem" }}>
<label>Email</label>
<br />
{/* sfruttiamo gli attributi di validazione nativi di HTML5, come required e minLength={6}. In questo modo è direttamente 
il browser a bloccare l'invio del form e ad avvisare l'utente se tenta di inserire una password troppo corta, fornendo un 
feedback visivo immediato e a costo zero.
D'altronde siamo consapevoli che un utente malintenzionato potrebbe ignorare completamente la nostra applicazione react per inviare 
una richiesta HTTP POST direttamente al backend. La nostra scelta è stata adotta per semplicità del progetto ed evitare 
complicazioni su argomenti sconosciuti o poco praticati */}
<input
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
required
/>
</div>
<div style={{ marginBottom: "0.8rem" }}>
<label>Password</label>
<br />
<input
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
required
minLength={6}
/>
</div>
<button type="submit">Crea account</button>
</form>
<p>
Hai già un account? <Link to="/login">Accedi</Link>
</p>
</div>
);
}