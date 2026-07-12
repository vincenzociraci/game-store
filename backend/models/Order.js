import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
    //game e user sono riferimenti, non contengono il documento intero ma l'id, games è un array
    //perchè ordine può avere più giochi
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    games: [{type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true}],
  },
   //aggiunge campi createdAt e updatedAt
     { timestamps: true }
)

export default mongoose.model("Order", orderSchema);