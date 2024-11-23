// Importa o framework Express para criação da aplicação web
import express from "express";

// Importa o middleware multer para gerenciar uploads de arquivos
import multer from "multer";

// Importa as funções controladoras para posts vindas do arquivo postsController.js
import { listaPosts, postarNovoPost, uploadImagem, AtualizarNovoPost } from "../controllers/postsController.js";
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200
}

// Configura o armazenamento para uploads em disco
const storage = multer.diskStorage({
  // Função callback para definir o diretório de destino
  destination: function (req, file, cb) {
    // Define o diretório "uploads/" para armazenar os arquivos
    cb(null, 'uploads/');
  },
  // Função callback para definir o nome do arquivo
  filename: function (req, file, cb) {
    // Mantém o nome original do arquivo enviado
    cb(null, file.originalname);
  }
})

// Cria uma instância do middleware multer com as configurações de storage
const upload = multer({ dest: "./uploads", storage });

// Define as rotas da aplicação
const routes = (app) => {
  // Permite que a aplicação receba dados no formato JSON
  app.use(express.json());
  app.use(cors(corsOptions))

  // Rota GET para listar todos os posts (listaPosts é a função controladora)
  app.get('/posts', listaPosts);

  // Rota POST para criar um novo post (postarNovoPost é a função controladora)
  app.post('/posts', postarNovoPost);

  // Rota POST para upload de imagem (upload.single("imagem") é o middleware e uploadImagem é a função controladora)
  // O middleware upload.single("imagem") espera um arquivo chamado "imagem" na requisição
  app.post('/upload', upload.single("imagem"), uploadImagem);

  app.put("/upload/:id", AtualizarNovoPost)
}

// Exporta a função routes para uso em outros arquivos
export default routes;