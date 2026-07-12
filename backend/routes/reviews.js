import express from "express";
import Review from "../models/Review.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/games/:gameId/reviews - tutte le recensioni di un gioco
//niente requireAuth, chiunque può leggerle
router.get("/games/:gameId/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ game: req.params.gameId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    //Internal Server Error 500
    res.status(500).json({ message: "Errore nel recupero delle recensioni", error: err.message });
  }
});

// POST /api/games/:gameId/reviews - crea una recensione (utente autenticato)
//solo utente può creare recensione, usa requireAuth
router.post("/games/:gameId/reviews", requireAuth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Voto e commento sono obbligatori" });
    }

    const review = await Review.create({
    //user e username non sono presi dal req.body ma da req.user per evitare che utente 
    //lasci recensione a nome di un altro
      game: req.params.gameId,
      user: req.user.id,
      username: req.user.username,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Errore nella creazione della recensione", error: err.message });
  }
});

// DELETE /api/reviews/:id - elimina una recensione (solo admin) due middleware
//quando cancello singola recensione la identifico per id senza sapere il gioco al quale appartiene

router.delete("/reviews/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Recensione non trovata" });
    res.json({ message: "Recensione eliminata" });
  } catch (err) {
    res.status(500).json({ message: "Errore nell'eliminazione della recensione", error: err.message });
  }
});

export default router;