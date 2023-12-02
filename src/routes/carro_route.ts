import { Router } from "express";
import { allVeiculosFrom, createVeiculo } from "../repositories/repositoryDetran";
import { CreateVeiculoSchema } from "../schemas/schema_Detran";

const router = Router();

router.get("/", async (req, res) => {
    const cpf = req.query.cpf as string;

    if (!cpf) {
        return res.status(400).json({ error: "CPF inválido ou não fornecido" });
    }
    
    try {
        const veiculos = await allVeiculosFrom(cpf);
        return res.json(veiculos);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar veículos" });
    }
});

router.post("/", async (req, res) => {
    try {
        const veiculoData = CreateVeiculoSchema.parse(req.body);
        await createVeiculo(veiculoData.placa, veiculoData.marca, veiculoData.modelo, veiculoData.cor, veiculoData.ano, veiculoData.cpf_motorista);
        return res.status(201).send({ message: "Veículo criado com sucesso" });
    } catch (error) {
        return res.status(400).json({ error: "Dados inválidos ou erro ao criar veículo" });
    }
});

export default router;
