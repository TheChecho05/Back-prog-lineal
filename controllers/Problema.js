import ProblemaTransporte from '../models/Problema.js';

export const crearProblema = async (req, res) => {
    try {
        const nuevoProblema = new ProblemaTransporte(req.body);
        const problemaGuardado = await nuevoProblema.save();
        res.status(201).json(problemaGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al crear problema", error: error.message });
    }
};

export const actualizarProblema = async (req, res) => {
    try {
        const problema = await ProblemaTransporte.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(problema);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar problema", error: error.message });
    }
};

export const obtenerProblemas = async (req, res) => {
    try {
        // El populate trae la info real de las plantas y ciudades
        const problemas = await ProblemaTransporte.find()
            .populate('origenes.origenId', 'nombre oferta') 
            .populate('destinos.destinoId', 'nombre demanda');
        res.status(200).json(problemas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener problemas", error: error.message });
    }
};

export const obtenerProblemaPorId = async (req, res) => {
    try {
        const problema = await ProblemaTransporte.findById(req.params.id)
            .populate('origenes.origenId', 'nombre oferta')
            .populate('destinos.destinoId', 'nombre demanda');
            
        if (!problema) {
            return res.status(404).json({ mensaje: "Problema no encontrado" });
        }
        res.status(200).json(problema);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar el problema", error: error.message });
    }
};
export const resolverProblema = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Buscamos el problema con los datos poblados
        const problema = await ProblemaTransporte.findById(id)
            .populate('origenes.origenId', 'nombre oferta')
            .populate('destinos.destinoId', 'nombre demanda');

        if (!problema) {
            return res.status(404).json({ mensaje: "Problema no encontrado" });
        }

        // 2. Preparamos las variables para el algoritmo
        const origenes = problema.origenes;
        const destinos = problema.destinos;
        const matrizCostos = problema.matrizCostos;

        let ofertas = origenes.map(o => o.oferta);
        let demandas = destinos.map(d => d.demanda);

        // Creamos la matriz de costos 2D basándonos en los IDs
        let costos = [];
        for (let i = 0; i < origenes.length; i++) {
            costos[i] = [];
            for (let j = 0; j < destinos.length; j++) {
                const idOrigen = origenes[i].origenId._id.toString();
                const idDestino = destinos[j].destinoId._id.toString();
                
                const costoObj = matrizCostos.find(m => 
                    m.origenId.toString() === idOrigen && 
                    m.destinoId.toString() === idDestino
                );
                costos[i][j] = costoObj ? costoObj.costo : 0;
            }
        }

        // 3. Ejecutamos el Método de Vogel
        let asignaciones = origenes.map(() => destinos.map(() => 0));
        let pasos = [];
        let iteracion = 1;
        let costoTotal = 0;

        while (ofertas.some(o => o > 0) && demandas.some(d => d > 0)) {
            let penalizacionesFilas = [];
            let penalizacionesCols = [];

            // Calcular DIF de Filas
            for (let i = 0; i < origenes.length; i++) {
                if (ofertas[i] === 0) {
                    penalizacionesFilas.push(-1);
                    continue;
                }
                let costosActivos = [];
                for (let j = 0; j < destinos.length; j++) {
                    if (demandas[j] > 0) costosActivos.push(costos[i][j]);
                }
                costosActivos.sort((a, b) => a - b);
                let dif = costosActivos.length >= 2 
                    ? costosActivos[1] - costosActivos[0] 
                    : (costosActivos.length === 1 ? costosActivos[0] : 0);
                penalizacionesFilas.push(dif);
            }

            // Calcular DIF de Columnas
            for (let j = 0; j < destinos.length; j++) {
                if (demandas[j] === 0) {
                    penalizacionesCols.push(-1);
                    continue;
                }
                let costosActivos = [];
                for (let i = 0; i < origenes.length; i++) {
                    if (ofertas[i] > 0) costosActivos.push(costos[i][j]);
                }
                costosActivos.sort((a, b) => a - b);
                let dif = costosActivos.length >= 2 
                    ? costosActivos[1] - costosActivos[0] 
                    : (costosActivos.length === 1 ? costosActivos[0] : 0);
                penalizacionesCols.push(dif);
            }

            // Encontrar la mayor penalización (DIF)
            let maxPenalizacion = -1;
            let tipoMayor = ''; 
            let indiceMayor = -1;

            penalizacionesFilas.forEach((val, index) => {
                if (val > maxPenalizacion) {
                    maxPenalizacion = val;
                    tipoMayor = 'fila';
                    indiceMayor = index;
                }
            });

            penalizacionesCols.forEach((val, index) => {
                if (val > maxPenalizacion) {
                    maxPenalizacion = val;
                    tipoMayor = 'columna';
                    indiceMayor = index;
                }
            });

            // Encontrar la celda de menor costo en la fila/columna seleccionada
            let menorCosto = Infinity;
            let filaElegida = -1;
            let colElegida = -1;

            if (tipoMayor === 'fila') {
                for (let j = 0; j < destinos.length; j++) {
                    if (demandas[j] > 0 && costos[indiceMayor][j] < menorCosto) {
                        menorCosto = costos[indiceMayor][j];
                        filaElegida = indiceMayor;
                        colElegida = j;
                    }
                }
            } else {
                for (let i = 0; i < origenes.length; i++) {
                    if (ofertas[i] > 0 && costos[i][indiceMayor] < menorCosto) {
                        menorCosto = costos[i][indiceMayor];
                        filaElegida = i;
                        colElegida = indiceMayor;
                    }
                }
            }

            // Asignar cantidad
            let cantidadAsignar = Math.min(ofertas[filaElegida], demandas[colElegida]);
            asignaciones[filaElegida][colElegida] = cantidadAsignar;
            costoTotal += cantidadAsignar * menorCosto;

            // Guardar el paso
            pasos.push({
                iteracion,
                tipoMayor,
                penalizacionesFilas: [...penalizacionesFilas],
                penalizacionesCols: [...penalizacionesCols],
                filaElegida,
                colElegida,
                cantidadAsignar,
                menorCosto
            });

            // Actualizar ofertas y demandas
            ofertas[filaElegida] -= cantidadAsignar;
            demandas[colElegida] -= cantidadAsignar;
            iteracion++;
        }

        // 4. Guardamos la solución en el problema
        problema.solucion = { asignaciones, costoTotal, pasos };
        await problema.save();

        res.status(200).json({
            mensaje: "Método de Vogel ejecutado con éxito",
            solucion: problema.solucion
        });

    } catch (error) {
        res.status(500).json({ mensaje: "Error al resolver el problema", error: error.message });
    }
};