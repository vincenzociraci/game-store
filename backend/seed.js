import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Game from "./models/Game.js";

dotenv.config();

const sampleGames = [
  {
    title: "Gioco1",
    description: "Platformer 2D retro",
    genre: "Platform",
    coverImage: "",
  },
  {
    title: "Gioco2",
    description: "Combattimenti real time.",
    genre: "Sparatutto",
    coverImage: "",
  },
  {
    title: "Gioco 3",
    description: "Puzzle game rilassante.",
    genre: "Puzzle",
    coverImage: "",
  },
  {
    title: "Gioco4",
    description: "Turn Based RPG",
    genre: "Strategia",
    coverImage: "",
  },
];

async function seed() {
  await connectDB();

  //cancella tutti i giochi esistenti e ne inserisce 4 di test
  await Game.deleteMany({});
  await Game.insertMany(sampleGames);
  console.log(`Inseriti ${sampleGames.length} giochi di esempio`);

  const adminEmail = "admin@gamestore.it";
  const existingAdmin = await User.findOne({ email: adminEmail });
//se esiste già l'admin non viene ricreato per evitare perdita recensioni
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("Admin123!", 10);
    await User.create({
      username: "admin",
      email: adminEmail,
      passwordHash,
      role: "admin",
    });
    console.log("Creato utente amministratore:");
    console.log("  email: admin@gamestore.it");
    console.log("  password: Admin123!");
  } else {
    console.log("L'utente amministratore esiste già");
  }

  await mongoose.connection.close();
  console.log("Seed completato");
}

seed().catch((err) => {
  console.error("Errore durante il seed:", err);
  process.exit(1); //l'1 significa errore
});