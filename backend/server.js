
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger-output.json' assert { type: "json" };

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

import express from "express";
import dotenv from "dotenv"; //carica variabili da .env
import cors from "cors"; //cross origin resource sharing
import cookieParser from "cookie-parser";  //per parsare i cookie del res. o populate
import { connectDB } from "./config/db.js"; //funzione creata in db.js per il DB

import authRoutes from "./routes/auth.js"; //Route di autenticazione
import gameRoutes from "./routes/games.js"; 
import reviewRoutes from "./routes/reviews.js";
import orderRoutes from "./routes/orders.js";

dotenv.config();

const app = express();

app.use(
    //di norma browser blocca richiesta da un origin verso altra
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    //con questo il browser include i cookie nelle richieste cross-origin
    credentials: true,
  })
);
app.use(express.json()); //permette ad express di leggere il corpo richieste inviate come JSON
app.use(cookieParser()); 

//ordine non è importante perchè route non si sovrappongono
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", reviewRoutes);

app.get("/", (req, res) => {
  res.json({ message: "GameStore API attiva" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    //prima mi connetto al DB e poi avvio server per evitare che il server risponda prima che DB sia pronto
  app.listen(PORT, () => console.log(`Server in ascolto sulla porta ${PORT}`));
});

