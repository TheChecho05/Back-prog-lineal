import mongoose from "mongoose";

const DestinoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    demanda: { type: Number, required: true }
});

export default mongoose.model("Destino", DestinoSchema);