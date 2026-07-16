//qui avviene il punto di avvio dell'intera applicazione React, dove la struttura è composta da contenitori annidati tra loro
//i quali ognuno ha dei diversi ruoli all'interno del DOM

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(  
//prende il <div id="root"> di index.html e lo trasforma nella radice in cui React userà il controllo

<React.StrictMode>  
   <BrowserRouter>
      <AuthProvider>
         <CartProvider>
            <App />
         </CartProvider>
       </AuthProvider>
    </BrowserRouter>
</React.StrictMode>
);

/*
-React.StrictMode è uno strumento di sviluppo che esegue controlli extra per cercare dei pattern obsoleti;
-BrowserRouter attiva il routing lato client basato sulla History API del browser, e deve avvolgere tutto il resto, poiché qualsiasi
componente potrebbe aver bisogno di sapere "in che pagina siamo" o di navigare altrove;
-AuthProvider e CartProvider rendono disponibili i rispettivi Context a tutti i componenti annidati dentro <App /> , a qualunque
profondità.

L'ordine di annidamento tra i due Provider non ha conseguenze funzionali in questo progetto (nessuno dei due dipende dall'altro), ma è
comunque una buona abitudine pensarci: se in futuro il carrello dovesse "conoscere" l'utente loggato, CartProvider dovrebbe restare
annidato dentro AuthProvider (come già scritto), per poter eventualmente usare useAuth() al proprio interno.
*/