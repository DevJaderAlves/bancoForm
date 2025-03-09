require('dotenv').config();
const mysql = require('mysql2');

// Configuração do banco de dados
const dbConfig = process.env.DATABASE_URL
  ? { uri: process.env.DATABASE_URL } // Se a URL completa existir, usa ela
  : {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    };

const db = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 10000,
  queueLimit: 0
});

// Testando conexão
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Erro ao conectar no MySQL:", err.message);
    process.exit(1);
  } else {
    console.log("✅ Conectado ao MySQL!");
    connection.release();
  }
});

module.exports = db;



