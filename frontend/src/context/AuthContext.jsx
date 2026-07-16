//Per risolvere il problema del prop drilling andremo a creare un nuovo Context per gestire l'identità dell'utente e l'autenticazione
//Questo permetterà di leggere o modificare lo stato della sessione qualunque sia la profondità dell'insieme dei componenti  

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/api";
// Il Context vero e proprio: un "contenitore" di stato condiviso,
// inizialmente vuoto (null) finché non viene "popolato" dal Provider qui sotto.
const AuthContext = createContext(null);
/**
* AuthProvider avvolge l'intera app (lo collegheremo in main.jsx) e si occupa di:
* - tenere traccia di chi è l'utente loggato (o null se nessuno è loggato)
* - esporre le funzioni login/register/logout a tutti i componenti figli
*/
export function AuthProvider({ children }) {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);


// Al primissimo caricamento dell'app, chiediamo al backend "chi sono?"
// Se il browser ha già un cookie di sessione valido (da una visita precedente),
// il backend risponderà con i dati dell'utente e resteremo "loggati"
// senza dover rifare il login manualmente ad ogni refresh della pagina.
useEffect(() => {
api.me()    //interrogazione dell' endpoint /api/auth/me
.then((data) => setUser(data.user))   //se l'endpoint restituisce un cookie httpOnly di sessione valido, il backend restituisce
                                      //i dati dell'utente loggato
.catch(() => setUser(null))   //quando c'è un errore reimposta l'utente a null 
.finally(() => setLoading(false));  //fase di inizializzazione conclusa e si procede con la renderizzazione delle pagine
}, []);

//impostazione di 3 funzioni asincrone che espongono le procedure di autenticazione (login, registrazione e logout)
//che delegano la chiamata di rete effettiva al modulo api.js e in caso di successo aggiornano lo stato locale user
async function login(email, password) {
const data = await api.login({ email, password });
setUser(data.user);
}
async function register(username, email, password) {
const data = await api.register({ username, email, password });
setUser(data.user);
}
async function logout() {
await api.logout();
setUser(null);
}
// Questo è l'oggetto che verrà messo a disposizione di tutti i componenti
// che useranno useAuth() qui sotto.
const value = {
user,
loading,
isAuthenticated: !!user,           //proprietà booleana per l'autenticazione dove !!user converte l'oggetto utente in booleano
                                   
isAdmin: user?.role === "admin",   //proprietà boolena per l'amministratore con un optional chaining per verificare il ruolo senza errori di runtime,
                                   //inoltre se l'utente non è autenticato, la variabile user vale null. Tentare di accedere a una
                                   //proprietà di null (scrivendo null.role) genererebbe un'eccezione JavaScript fatale di tipo 
                                   //TypeError: Cannot read properties of null, che farebbe andare in crash l'intera applicazione React.
login,
register,
logout,
};
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
/**
* Hook di comodo: invece di scrivere ovunque useContext(AuthContext),
* i componenti scriveranno semplicemente useAuth().
*/

//per evitare di chiamare ogni volta useContext(AuthContext) in ogni file usiamo una funzione che fa questa procedura che poi
//verrà invocata negli altri file come una costante: const { user, isAdmin } = useAuth()."
export function useAuth() {
return useContext(AuthContext);
}