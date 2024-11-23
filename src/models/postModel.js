import { ObjectId } from "mongodb";
import 'dotenv/config';
import conectarAoBanco from "../config/dbConfig.js";

// Função assíncrona para obter todos os posts do banco de dados
// Conecta ao banco de dados usando a string de conexão fornecida pela variável de ambiente
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

export async function getTodosPosts() {
    // Seleciona o banco de dados "Imersão-Instabyte"
    const db = conexao.db("Imersão-Instabyte");
    // Seleciona a coleção "posts"
    const colecao = db.collection("posts");
    // Retorna todos os documentos da coleção como um array
    return colecao.find().toArray();
}

// Função assíncrona para criar um novo post no banco de dados MongoDB
export async function criarPost(novoPost) {
    // Obtém a conexão com o banco de dados MongoDB
    const db = conexao.db("Imersão-Instabyte");
    // Seleciona a coleção "posts" no banco de dados
    const colecao = db.collection("posts");
    // Insere o novo post na coleção e retorna o resultado da operação
    return colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost) {
    const db = conexao.db("Imersão-Instabyte");
    const colecao = db.collection("posts");
    const objID = ObjectId.createFromHexString(id)
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:novoPost});
  }