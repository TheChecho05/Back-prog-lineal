import mongoose from "mongoose";

const ProblemaTransporteSchema = new mongoose.Schema({
    Problema: { type: String, required: true },
    origenes: [{
        origenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Origen', required: true },
        oferta: { type: Number, required: true }
    }],
    destinos: [{
        destinoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destino', required: true },
        demanda: { type: Number, required: true }
    }],
    matrizCostos: [{
        origenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Origen', required: true },
        destinoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destino', required: true },
        costo: { type: Number, required: true }
    }],
    solucion: {
        asignaciones: { type: Array, default: [] },
        costoTotal: { type: Number },
        pasos: { type: Array, default: [] } // Para el historial de las DIF
    }
}, {
    timestamps: true
});

export default mongoose.model("ProblemaTransporte", ProblemaTransporteSchema);