import { Router } from "express";
import { allMotoristas, createMotorista } from "../repositories/repositoryDetran";
import { CreateSchemaMotorista } from "../schemas/schema_Detran";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const motoristas = await allMotoristas();
        return res.status(200).json(motoristas);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar motoristas" });
    }
});

router.post("/", async (req, res) => {
    try {
        const motoristaData = CreateSchemaMotorista.parse(req.body);
        await createMotorista(motoristaData.cpf, motoristaData.nome, motoristaData.vencimento_cnh, motoristaData.categoria_cnh);
        return res.status(201).send({ message: "Motorista criado com sucesso" });
    } catch (error) {
        return res.status(400).json({ error: "Dados inválidos ou erro ao criar motorista" });
    }
});

export default router;
