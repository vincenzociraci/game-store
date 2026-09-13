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
    cover: "https://i.imgur.com/XaXQMt9.png",
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
    cover: "https://i.imgur.com/bzzDowc.png",
  },
  {
    title: "Dragon Quest 3",
    description: "Turn Based RPG",
    genere: "Strategia",
    cover: "https://i.imgur.com/j633bMh.png",
  },
  {
    title: "Chrono Trigger",
    description: "Turn Based RPG",
    genere: "Strategia",
    cover: "https://i.imgur.com/oJliXG4.png",
  },
  {
    title: "Final Fantasy VII Remake",
    description: "Turn Based RPG",
    genere: "Strategia",
    cover: "https://i.imgur.com/27ca6Rs.png",
  },
  {
    title: "Professor Layton e il Futuro Perduto",
    description: "Risolvi rompicapi.",
    genere: "Puzzle",
    cover: "https://i.imgur.com/xvkYSzf.png",
  },
   {
    title: "Hollow Knight",
    description: "Platformer 2D Metroidvania",
    genere: "Platform",
    cover: "https://i.imgur.com/4ZOqE9b.png",
  },
    {
    title: "Hollow Knight Silksong",
    description: "Platformer 2D Metroidvania",
    genere: "Platform",
    cover: "https://i.imgur.com/KQophA9.png",
  },
  {
    title: "Crash Bandicoot",
    description: "Platformer 3D",
    genere: "Platform",
    cover: "https://i.imgur.com/LWe8LTB.png",
  },
  {
    title: "Tom Clancy's Rainbow Six: Siege",
    description: "Combattimenti real time.",
    genere: "Sparatutto",
    cover: "https://i.imgur.com/WDGXWDr.png",
  },
  {
    title: "Call of Duty Black Ops 6",
    description: "Combattimenti real time.",
    genere: "Sparatutto",
    cover: "https://i.imgur.com/WDGXWDr.png",
  },
  {
    title: "God of War",
    description: "Avventura dinamica con puzzle.",
    genere: "Puzzle",
    cover: "https://i.imgur.com/zFCmID3.png",
  },
  {
    title: "Sonic The Hedgehog",
    description: "Platformer 2d Retro",
    genere: "Platform",
    cover: "https://i.imgur.com/0wOp6wf.jpeg",
  },
  {
    title: "Donkey Kong Country",
    description: "Platformer 2d Retro",
    genere: "Platform",
    cover: "https://i.imgur.com/wvElvS3.jpeg",
  },
  {
    title: "Megaman 11",
    description: "Platformer 2d",
    genere: "Platform",
    cover: "https://i.imgur.com/7GrjrLQ.png",
  },
  {
    title: "Expedition 33",
    description: "Turn Based RPG",
    genere: "Strategia",
    cover: "https://i.imgur.com/kGwDhvo.png",
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