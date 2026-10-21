import mongoose from "mongoose";

const OrigenSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    oferta: { type: Number, required: true }
});

export default mongoose.model("Origen", OrigenSchema);