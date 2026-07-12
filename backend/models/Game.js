import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
    {
        //solo title è obbligatorio gli altri hanno campo default vuoto
        title:{type: String, required: true, trim:true},
        description:{type: String, default: ""},
        genere:{type: String, default: ""},
        //url immagine copertina quindi string
        cover:{type: String, default: ""},
    },
    //aggiunge campi createdAt e updatedAt
     { timestamps: true }
);

export default mongoose.model("Game", gameSchema);