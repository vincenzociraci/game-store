import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        //game e user sono riferimenti, non contengono il documento intero ma l'id
        game: {type: mongoose.Schema.Types.ObjectId, ref: "Game", required:true},
        user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
        rating: {type: Number, required: true, min: 1, max: 5},
        comment: {type: String, required: true, trim: true},
    } ,
     //aggiunge campi createdAt e updatedAt
     { timestamps: true }

);
export default mongoose.model("Review", reviewSchema);