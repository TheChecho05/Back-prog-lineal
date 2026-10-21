import Origen from '../models/origenes.js';

export const crearOrigen = async (req, res) => {
    try {
        const nuevoOrigen = new Origen(req.body);
        const origenGuardado = await nuevoOrigen.save();
        res.status(201).json(origenGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al crear origen", error: error.message });
    }
};

export const obtenerOrigenes = async (req, res) => {
    try {
        const origenes = await Origen.find();
        res.status(200).json(origenes);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener origenes", error: error.message });
    }
};

export const actualizarOrigen = async (req, res) => {
    try {
        const origen = await Origen.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(origen);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar origen", error: error.message });
    }
};

export const eliminarOrigen = async (req, res) => {
    try {
        const origen = await Origen.findByIdAndDelete(req.params.id);
        if (!origen) {
            return res.status(404).json({ mensaje: "Planta no encontrada" });
        }
        res.status(200).json({ mensaje: "Planta eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar planta", error: error.message });
    }
};