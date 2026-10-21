import express from 'express';
import { 
    crearProblema, 
    obtenerProblemas, 
    obtenerProblemaPorId,
    resolverProblema, // <-- 1. Importar la nueva función
    actualizarProblema
} from '../controllers/Problema.js';

const router = express.Router();

router.post('/', crearProblema);
router.put('/:id', actualizarProblema);
router.get('/', obtenerProblemas);
router.get('/:id', obtenerProblemaPorId);
router.post('/:id/resolver', resolverProblema); // <-- 2. Agregar la nueva ruta
 

export default router;