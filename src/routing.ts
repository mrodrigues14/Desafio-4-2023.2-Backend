import { type Express } from "express";
import veiculoRouter from "./routes/carro_route";
import motoristasRouter from "./routes/motorista_route";
import multasRouter from "./routes/multa_route";

export default function routing(app: Express) {
  app.use('/motorista', motoristasRouter);
  app.use('/multa', multasRouter);
  app.use('/carro', veiculoRouter);
}