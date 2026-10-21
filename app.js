import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Fuerza a usar los DNS de Google
dns.setDefaultResultOrder('ipv4first'); // Prioriza IPv4 para evitar problemas en Windows

import express from "express";
import "dotenv/config";
import cors from "cors";
import dbConexion from "./database/cnxmongoose.js";

import destinos from "./routes/Destinos.js";
import origenes from "./routes/Origenes.js";
import problemas from "./routes/Problema.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/api/destinos", destinos);
app.use("/api/origenes", origenes);
app.use("/api/problemas", problemas);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  dbConexion();
});