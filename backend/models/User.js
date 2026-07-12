import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        //Username e mail sono required e unique per evitare doppie registrazioni, trim toglie spazi vuoti
        username: {type:String, required:true, unique:true, trim:true},
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        //non è la password ma l'output dell'hashing
        passwordHash: { type: String, required: true },
        //rifiuta valori diversi da user e admin, ogni nuovo utente è di default un user
         role: { type: String, enum: ["user", "admin"], default: "user" },

    },
    //aggiunge campi createdAt e updatedAt
    { timestamps: true }
);

export default mongoose.model("User", userSchema);