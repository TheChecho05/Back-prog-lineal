import express from 'express';
import { crearOrigen, obtenerOrigenes, actualizarOrigen, eliminarOrigen } from '../controllers/Origenes.js';

const router = express.Router();

router.post('/', crearOrigen);
router.put('/:id', actualizarOrigen);
router.get('/', obtenerOrigenes);
router.delete('/:id', eliminarOrigen);

export default router;