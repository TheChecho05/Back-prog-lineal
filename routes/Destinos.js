import express from 'express';
import { crearDestino, obtenerDestinos, actualizarDestino, eliminarDestino } from '../controllers/Destinos.js';

const router = express.Router();

router.post('/', crearDestino);
router.get('/', obtenerDestinos);
router.put('/:id', actualizarDestino);
router.delete('/:id', eliminarDestino);

export default router;