import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Game from "./models/Game.js";

dotenv.config();

const sampleGames = [
  {
    title: "New Super Mario Bros DS",
    description: "Platformer 2D retro",
    genere: "Platform",
    cover: "https://i.imgur.com/wCqsFFB.png",
  },
  {
    title: "Halo 3",
    description: "Combattimenti real time.",
    genere: "Sparatutto",
    cover: "https://i.imgur.com/bIB6aJL.jpeg",
  },
  {
    title: "Tetris",
    description: "Puzzle game rilassante.",
    genere: "Puzzle",
    cover: "https://i.imgur.com/WGCceFK.jpeg",
  },
  {
    title: "Dragon Quest 3",
    description: "Turn Based RPG",
    genere: "Strategia",
    cover: "https://i.imgur.com/t2V2l0s.jpeg",
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