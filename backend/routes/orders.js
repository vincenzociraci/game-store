import express from "express";
import Order from "../models/Order.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// POST /api/orders - crea un ordine a partire dai giochi presenti nel carrello
router.post("/", requireAuth, async (req, res) => {
  try {
    //frontend invia array id di giochi presenti nel carrello
    const { gameIds } = req.body;

    if (!Array.isArray(gameIds) || gameIds.length === 0) {
      return res.status(400).json({ message: "Il carrello è vuoto" });
    }
  //prendo user non dal req.body ma dal token verificato
    const order = await Order.create({ user: req.user.id, games: gameIds });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Errore nella creazione dell'ordine", error: err.message });
  }
});

// GET /api/orders/me - storico ordini dell'utente autenticato
router.get("/me", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
    //populate trasforma l'array di ID in un array con Game completi
      .populate("games")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Errore nel recupero degli ordini", error: err.message });
  }
});

export default router;