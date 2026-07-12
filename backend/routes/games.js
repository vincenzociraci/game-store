import express from "express";
import Game from "../models/Game.js";

const router = express.Router();


// GET /api/games - lista di tutti i giochi disponibili
//non ha requireAuth perchè chiunque può vedere la lista di giochi
router.get("/", async (req, res) => {
  try {
    //restituisce tutti i giochi dal più recente al più vecchio (-1 è decrescente)
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: "Errore nel recupero dei giochi", error: err.message });
  }
});

// GET /api/games/:id - dettaglio di un singolo gioco
router.get("/:id", async (req, res) => {
  try {
    //id è parametro dinamico
    const game = await Game.findById(req.params.id);
    //se id non esiste, 404 Not Found
    if (!game) return res.status(404).json({ message: "Gioco non trovato" });
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: "Errore nel recupero del gioco", error: err.message });
  }
});

export default router;