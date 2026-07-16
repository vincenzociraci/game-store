//qui viene definita la mappa completa delle rotte dell'applicazione tramite i componenti Route e Routes di React Router

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import GameDetail from "./pages/GameDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
export default function App() {
return (
<div style={{ fontFamily: "sans-serif" }}>
  <Navbar />
<div style={{ padding: "1.5rem" }}>
<Routes>
   <Route path="/" element={<Home />} />
      <Route path="/games/:id" element={<GameDetail />} />
         <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />
                  <Route 
                     path="/admin"
                     element={
                       <PrivateRoute adminOnly>
                          <Admin />
                        </PrivateRoute>
                      }
/>
</Routes>
   </div>
   </div>
);
}

/*
Routes serve per osservare in quale URL si trova il client in quel preciso momento e sceglie
quale Route al suo interno corrisponde. Essendo la rotta Admin di tipo "protetta", questa viene
avvolta all'interno di un percorso padre PrivateRoute che a sua volta è avvolto in un prop (element). Il ruolo
di PrivateRoute è semplicemente quello di protezione della rotta Admin, dato che React Route non contiene un
protocollo specializzato nelle rotte protette.

La <Navbar /> viene disegnata fuori dal blocco <Routes> , così da restare sempre visibile su ogni pagina, indipendentemente da quale
rotta sia attiva in un dato momento.
*/