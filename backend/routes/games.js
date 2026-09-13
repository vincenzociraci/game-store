import express from "express";
import Game from "../models/Game.js";
import mongoose from "mongoose";
import Review from "../models/Review.js";

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


// GET /api/games/stats - voto medio e numero recensioni di TUTTI i giochi in un colpo solo
router.get("/stats", async (req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $group: {
          _id: "$game",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    // Trasformo l'array in un oggetto indicizzato per id del gioco,
    // cosi' il frontend puo' accedere direttamente con stats[gameId].
    const statsByGame = {};
    stats.forEach((s) => {
      statsByGame[s._id] = {
        averageRating: Math.round(s.averageRating * 10) / 10,
        totalReviews: s.totalReviews,
      };
    });

    res.json(statsByGame);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Errore nel calcolo delle statistiche", error: err.message });
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

// GET /api/games/:id/stats - voto medio e numero di recensioni di un gioco
router.get("/:id/stats", async (req, res) => {
   
  try {

    const stats = await Review.aggregate([
      { $match: { game: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $group: {
          _id: "$game",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length === 0) {
      return res.json({ averageRating: 0, totalReviews: 0 });
    }

    res.json({
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
    });
  } catch (err) {
    res.status(500).json({ message: "Errore nel calcolo delle statistiche", error: err.message });
  }
});

export default router;