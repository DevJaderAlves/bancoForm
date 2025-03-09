require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*', // Permite que o frontend acesse a API
  methods: ['GET', 'POST'], // Limita os métodos permitidos
  allowedHeaders: ['Content-Type']
}));

// Teste de rota para garantir que a API está rodando
app.get('/', (req, res) => {
  res.json({ message: "🚀 API rodando no Railway com sucesso!" });
});

// Rota para buscar todos os depoimentos
app.get('/depoimentos', (req, res) => {
  db.query("SELECT * FROM depoimentos ORDER BY data_criacao DESC", (err, results) => {
    if (err) {
      console.error("❌ Erro ao buscar depoimentos:", err.message);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
    res.json(results);
  });
});

// Rota para adicionar um novo depoimento
app.post('/depoimentos', (req, res) => {
  const { nome, comentario, nota } = req.body;
  if (!nome || !comentario || !nota) {
    return res.status(400).json({ error: "Preencha todos os campos!" });
  }

  const sql = "INSERT INTO depoimentos (nome, comentario, nota) VALUES (?, ?, ?)";
  db.query(sql, [nome, comentario, nota], (err, result) => {
    if (err) {
      console.error("❌ Erro ao adicionar depoimento:", err.message);
      return res.status(500).json({ error: "Erro ao salvar depoimento." });
    }
    res.json({ message: "✅ Depoimento adicionado com sucesso!", id: result.insertId });
  });
});

// Definir a porta para o Railway
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});

