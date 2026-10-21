import Destino from '../models/Destinos.js'; // Ajusta la ruta según tu estructura

export const crearDestino = async (req, res) => {
    try {
        const nuevoDestino = new Destino(req.body);
        const destinoGuardado = await nuevoDestino.save();
        res.status(201).json(destinoGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al crear destino", error: error.message });
    }
};

export const obtenerDestinos = async (req, res) => {
    try {
        const destinos = await Destino.find();
        res.status(200).json(destinos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener destinos", error: error.message });
    }
};
export const actualizarDestino = async (req, res) => {
    try {
        const destino = await Destino.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(destino);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar destino", error: error.message });
    }
};

export const eliminarDestino = async (req, res) => {
    try {
        const destino = await Destino.findByIdAndDelete(req.params.id);
        if (!destino) {
            return res.status(404).json({ mensaje: "Ciudad no encontrada" });
        }
        res.status(200).json({ mensaje: "Ciudad eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar ciudad", error: error.message });
    }
};