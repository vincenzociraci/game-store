//La pagina di Login ha un compito molto specifico: raccogliere le credenziali dell'utente in modo sicuro e delegare il 
//tentativo di accesso al nostro Context globale. A livello tecnico, è l'esempio perfetto per mostrare il pattern 
//dei componenti controllati in React

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Login() {
const { login } = useAuth();
const navigate = useNavigate();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
async function handleSubmit(e) {
e.preventDefault(); // impedisce al browser di ricaricare la pagina (comportamento di default di un <form>)
setError("");
try {
await login(email, password);
navigate("/"); // login riuscito → torniamo alla home
} catch (err) {
setError(err.message);
}
}
return (
<div style={{ maxWidth: 320 }}>
<h1>Login</h1>
{error && <p style={{ color: "red" }}>{error}</p>}
<form onSubmit={handleSubmit}>
<div style={{ marginBottom: "0.8rem" }}>
<label>Email</label>
<br />

{/*
In React, non leggiamo i dati degli input interrogando il DOM come si faceva in JavaScript vanilla 
(es. document.getElementById). Usiamo invece i componenti controllati: leghiamo il valore dell'input
(value) a uno stato React (email) e lo aggiorniamo a ogni battitura tramite l'evento onChange 
*/}
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
/>
</div>
<button type="submit">Accedi</button>
</form>
<p>
Non hai un account? <Link to="/register">Registrati</Link>
</p>
</div>
);
}

//nota importante: non abbiamo utlizzato l'hashing della password per via dell'obsoleta sicurezza basata sul client