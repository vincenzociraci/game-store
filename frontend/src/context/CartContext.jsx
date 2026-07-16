//in questo file avviene indicativamente la stessa dinamica del file AuthContext.js ma con un importante differenza:
//l'implementazione di un localStorage che permette la persistenza dei dati anche dopo la chiusura del server

import { createContext, useContext, useEffect, useState } from "react";
const CartContext = createContext(null);
const STORAGE_KEY = "gamestore_cart";
/**
* CartProvider tiene traccia dei giochi aggiunti al carrello.
* Il carrello viene salvato in localStorage: così, se l'utente
* chiude e riapre il browser, il carrello non viene perso
* (a differenza dello stato React puro, che si azzera ad ogni refresh).
*/
export function CartProvider({ children }) {
const [items, setItems] = useState(() => {
// Questa funzione viene eseguita una sola volta, al primo render (inizializzazione lazy),
// per inizializzare lo stato leggendo eventuali dati già salvati.
const saved = localStorage.getItem(STORAGE_KEY);
return saved ? JSON.parse(saved) : [];
});
// Ogni volta che "items" cambia, salviamo la nuova versione in localStorage.
useEffect(() => {
localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}, [items]);

//serie di funzioni che sfruttano il functional update, il quale permette di lavorare sempre con lo stato più
//recente, rispettando l'imutabilità dei props restituendo un nuovo array con lo spread operator (...) invece che modificare il vecchio array
function addToCart(game) {
setItems((prev) => {
const alreadyPresent = prev.some((g) => g._id === game._id);
if (alreadyPresent) return prev; // evitiamo duplicati
return [...prev, game];
});
}
function removeFromCart(gameId) {
setItems((prev) => prev.filter((g) => g._id !== gameId));
}
function clearCart() {
setItems([]);
}
const value = { items, addToCart, removeFromCart, clearCart };
return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
return useContext(CartContext);
}

//essendo il salvataggio dei giochi nel carrello una procedura che avviene soltanto in lato frontend fino a quando non si fa una
//richiesta al server per fare il checkout, non è necessario utilizzare dei cookie per ricordare al server quali fossero i dati salvati
//evitando così di sprecare banda
