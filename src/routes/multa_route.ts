import { Router } from "express";
import { allMultasFrom, allPontos, createMulta } from "../repositories/repositoryDetran";
import { CreateMultaSchema } from "../schemas/schema_Detran";

const router = Router();

router.get("/", async (req, res) => {
    const cpf = req.query.cpf as string;

    if (!cpf) {
        return res.status(400).json({ error: "CPF inválido ou não fornecido" });
    }
    
    try {
        const multas = await allMultasFrom(cpf);
        return res.status(200).json(multas);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar multas" });
    }
});

router.get("/retidos", async (req, res) => {
    try {
        const motoristasMaisQue = await allPontos();
        return res.status(200).json(motoristasMaisQue);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar motoristas com pontos retidos" });
    }
});

router.post("/", async (req, res) => {
    try {
        const multaData = CreateMultaSchema.parse(req.body);
        await createMulta(multaData.valor, multaData.data, multaData.pontos, multaData.tipo, multaData.placa_carro);
        return res.status(201).send({ message: "Multa criada com sucesso" });
    } catch (error) {
        return res.status(400).json({ error: "Dados inválidos ou erro ao criar multa" });
    }
});

export default router;
