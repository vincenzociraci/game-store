import mongoose from "mongoose";

export async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connesso a MongoDB correttamente");
    } catch (err){
        console.error("Errore connessione a MongoDB:", err.message);
        process.exit(1)
    }
}