import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();


const cookieOptions = {
    //Impedisce a js lato client di leggere o modificare cookie
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // può essere utilizzato solo in un contesto first-party
  // ma è inviato anche quando un utente naviga verso l’origin site dall’esterno
  //con lax il browser rifiuta di allegare i cookie nel deployment render
 sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // durata cookie, 7 giorni
};

function createToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}


// POST /api/auth/register
router.post("/register", async (req, res) => {    //async perchè fa query al DB e hashing
  try {
    const { username, email, password } = req.body; //req.body contiene i dati JSON inviati dal client

    if (!username || !email || !password) {
        //se manca uno dei tre campi, 400 bad request, ed esco con return
      return res.status(400).json({ message: "Username, email e password sono obbligatori" });
    }
    //chiedo a DB di trovare un utente con mail o username dati, se esistono
    //rispondo 409 Conflict
     const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: "Username o email già registrati" });
    }
    //la password viene trasformata in hash prima di essere passata all'user.create
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash });

    //creo il token per l'utente e lo imposto come cookie
    const token = createToken(user);
    res.cookie("token", token, cookieOptions);

    //201 Created, restituisco al frontend solo dati pubblici non hash
    res.status(201).json({
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
    //se qualcosa va storto, 500 Internal Server Error
  } catch (err) {
    res.status(500).json({ message: "Errore durante la registrazione", error: err.message });
  }
});



// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Credenziali non valide" });
    }
    
    //verifico la password hashata ricalcolando l'hash e vedendo se combacia
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
    //non viene detto nell'errore se è la mail o la password ad essere sbagliata per privacy
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    const token = createToken(user);
    res.cookie("token", token, cookieOptions);

    res.json({
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Errore durante il login", error: err.message });
  }
});




// POST /api/auth/logout
router.post("/logout", (req, res) => {      //non è async perchè non interagisce con DB
  res.clearCookie("token", cookieOptions);  //dice al browser di eliminare il cookie "Token"
  res.json({ message: "Logout effettuato" });
});


// GET /api/auth/me
//chiama prima requireAuth, se questo chiama next() chiama la funzione finale
router.get("/me", requireAuth, async (req, res) => {
    //uso l'id per recuperare i dati aggiornati dell'utente dal DB
  const user = await User.findById(req.user.id).select("-passwordHash");  //.select -passwordHash significa restituisci tutto tranne questo
  //se non trova utente, 404 Not Found
  if (!user) return res.status(404).json({ message: "Utente non trovato" });
  res.json({ user });
});



export default router;
