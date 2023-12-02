import { z } from "zod";

// data
const formatDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const datePreprocessor = z.preprocess((arg) => arg instanceof Date ? formatDate(arg) : arg, z.string().regex(dateRegex));

// Motorista
export const SchemaMotorista = z.object({
    cpf: z.string().length(11),
    nome: z.string().min(3).max(100),
    vencimento_cnh: datePreprocessor,
    categoria_cnh: z.enum(['A', 'B', 'AB']),
});
export type Motorista = z.infer<typeof SchemaMotorista>;

// Veículo
export const SchemaVeiculo = z.object({
    placa: z.string().length(8),
    marca: z.string().min(3).max(20),
    modelo: z.string().min(3).max(20),
    ano: z.number().int().min(1900).max(new Date().getFullYear()),
    cor: z.string().min(3).max(20),
});
export type Veiculo = z.infer<typeof SchemaVeiculo>;

// Multa
export const SchemaMulta = z.object({
    valor: z.number().positive(),
    data: datePreprocessor,
    pontos: z.number().int().positive(),
    tipo: z.string().min(3).max(40),
});
export type Multa = z.infer<typeof SchemaMulta>;

// Pontos
export const SchemaPontos = z.object({
    motorista: z.string().min(3).max(100),
    pontos: z.number().int().nonnegative(),
});
export type Pontos = z.infer<typeof SchemaPontos>;

// criação de motorista,veiculo,multa
export const CreateSchemaMotorista = SchemaMotorista.extend({
    vencimento_cnh: z.date(),
});
export type MotoristaCreate = z.infer<typeof CreateSchemaMotorista>;

export const CreateVeiculoSchema = SchemaVeiculo.extend({
    cpf_motorista: z.string().length(11),
});
export type VeiculoCreate = z.infer<typeof CreateVeiculoSchema>;

export const CreateMultaSchema = SchemaMulta.extend({
    data: z.date(),
    placa_carro: z.string().length(8),
});
export type MultaCreate = z.infer<typeof CreateMultaSchema>;
