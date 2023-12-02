import { mysqlConn } from "../base/mysql";
import { CreateSchemaMotorista, CreateMultaSchema, CreateVeiculoSchema, SchemaMulta, SchemaPontos, SchemaMotorista, SchemaVeiculo } from "../schemas/schema_Detran";

export async function allMotoristas() {
    const [result] = await mysqlConn.query("SELECT cpf, nome, categoria_cnh, vencimento_cnh FROM motorista");
    return SchemaMotorista.array().parse(result);
}

export async function allVeiculosFrom(cpf: string) {
    const [result] = await mysqlConn.query("SELECT V.placa, V.marca, V.modelo, V.ano, V.cor FROM VEICULO V INNER JOIN MOTORISTA M ON V.CPF_MOTORISTA = M.CPF WHERE M.CPF = ?", [cpf]);
    return SchemaVeiculo.array().parse(result);
}

export async function allMultasFrom(cpf: string) {
    const [result] = await mysqlConn.query("SELECT M.valor, M.data, M.pontos, M.tipo FROM MULTA M INNER JOIN VEICULO V ON M.PLACA_CARRO = V.PLACA INNER JOIN MOTORISTA MT ON V.CPF_MOTORISTA = MT.CPF WHERE MT.CPF = ?", [cpf]);
    return SchemaMulta.array().parse(result);
}

export async function allPontos() {
    const [result] = await mysqlConn.query("SELECT MT.NOME AS motorista, SUM(M.PONTOS) AS pontos FROM MOTORISTA MT INNER JOIN VEICULO V ON MT.cpf = V.cpf_motorista INNER JOIN MULTA M ON V.placa = M.placa_carro GROUP BY MT.NOME HAVING SUM(M.PONTOS) >= 10");
    return SchemaPontos.array().parse(result);
}

export async function createMotorista(cpf: string, nome: string, vencimento_cnh: Date, categoria_cnh: string) {
    const motorista = CreateSchemaMotorista.parse({ cpf, nome, vencimento_cnh, categoria_cnh });
    await mysqlConn.execute("INSERT INTO MOTORISTA (cpf, nome, vencimento_cnh, categoria_cnh) VALUES (?, ?, ?, ?)", [motorista.cpf, motorista.nome, motorista.vencimento_cnh, motorista.categoria_cnh]);
    const [resultCheck] = await mysqlConn.query("SELECT cpf, nome, vencimento_cnh, categoria_cnh FROM MOTORISTA WHERE CPF = ?", [motorista.cpf]);
    if (!resultCheck || resultCheck.length === 0) {
        throw new Error("Erro ao criar motorista");
    }
    return CreateSchemaMotorista.parse(resultCheck[0]);
}

export async function createVeiculo(placa: string, marca: string, modelo: string, cor: string, ano: number, cpf_motorista: string) {
    const veiculo = CreateVeiculoSchema.parse({ placa, marca, modelo, cor, ano, cpf_motorista });
    await mysqlConn.execute("INSERT INTO VEICULO (PLACA, MARCA, MODELO, COR, ANO, cpf_motorista) VALUES (?, ?, ?, ?, ?, ?)", [veiculo.placa, veiculo.marca, veiculo.modelo, veiculo.cor, veiculo.ano, veiculo.cpf_motorista]);
    const [resultCheck] = await mysqlConn.query("SELECT placa, marca, modelo, ano, cor, cpf_motorista FROM VEICULO WHERE PLACA = ?", [veiculo.placa]);
    if (!resultCheck || resultCheck.length === 0) {
        throw new Error("Erro ao criar veículo");
    }
    return CreateVeiculoSchema.parse(resultCheck[0]);
}

export async function createMulta(valor: number, dataInfracao: Date, pontos: number, tipo: string, placa_carro: string) {
    const multa = CreateMultaSchema.parse({ valor, data: dataInfracao, pontos, tipo, placa_carro });
    const result = await mysqlConn.execute("INSERT INTO MULTA (VALOR, data, PONTOS, TIPO, placa_carro) VALUES (?, ?, ?, ?, ?)", [multa.valor, multa.data, multa.pontos, multa.tipo, multa.placa_carro]);
    const [resultCheck] = await mysqlConn.query("SELECT valor, data, pontos, tipo, placa_carro FROM MULTA WHERE IDMULTA = ?", [result.insertId]);
    if (!resultCheck || resultCheck.length === 0) {
        throw new Error("Erro ao criar multa");
    }
    return CreateMultaSchema.parse(resultCheck[0]);
}
