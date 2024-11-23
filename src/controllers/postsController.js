import { getTodosPosts, criarPost, atualizarPost} from "../models/postModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Função assíncrona para listar todos os posts
export async function listaPosts(req, res) {
  // Chama a função do modelo para obter todos os posts do banco de dados
  const posts = await getTodosPosts();
  // Envia os posts como resposta em formato JSON com status 200 (sucesso)
  res.status(200).json(posts);
}

// Função assíncrona para criar um novo post
export async function postarNovoPost(req, res) {
  // Obtém os dados do novo post enviados no corpo da requisição
  const novoPost = req.body;
  try {
    // Chama a função do modelo para criar um novo post no banco de dados
    const postCriado = await criarPost(novoPost);
    // Envia o post criado como resposta em formato JSON com status 200 (sucesso)
    res.status(200).json(postCriado);
  } catch (erro) {
    // Imprime o erro no console para facilitar a depuração
    console.error(erro.message);
    // Envia uma resposta com status 500 (erro interno do servidor) e uma mensagem de erro genérica
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}
// Função assíncrona para fazer upload de uma imagem e criar um novo post
export async function uploadImagem(req, res) {
  // Cria um objeto com os dados do novo post, incluindo o nome do arquivo original
  const novoPost = {
    descricao: "", // Supondo que a descrição seja opcional
    imgUrl: req.file.originalname,
    alt: "" // Supondo que a descrição alternativa seja opcional
  };
  try {
    // Chama a função do modelo para criar um novo post no banco de dados
    const postCriado = await criarPost(novoPost);
    // Gera um novo nome para o arquivo da imagem, utilizando o ID do post criado
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
    // Renomeia o arquivo para o novo nome, movendo-o para o diretório de uploads
    fs.renameSync(req.file.path, imagemAtualizada);
    // Envia o post criado como resposta em formato JSON com status 200 (sucesso)
    res.status(200).json(postCriado);
  } catch (erro) {
    // Imprime o erro no console para facilitar a depuração
    console.error(erro.message);
    // Envia uma resposta com status 500 (erro interno do servidor) e uma mensagem de erro genérica
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}

export async function AtualizarNovoPost(req, res) {
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`
  const post = {
     imgUrl: urlImagem,
     descricao: req.body.descricao,
     alt: req.body.alt
  }
  try {
    const imageBuffer = fs.readFileSync(`uploads/${id}.png`)
    const descricao = await gerarDescricaoComGemini(imageBuffer)

    const post = {
      imgUrl: urlImagem,
      descricao: descricao,
      alt: req.body.alt
    }
    const postCriado = await atualizarPost(id, post);
    
    res.status(200).json(postCriado);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}