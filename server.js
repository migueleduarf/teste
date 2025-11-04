import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;
const app = express();
const PORT = process.env.PORT || 4000;
const SECRET = process.env.JWT_SECRET || "applejuice_secret_key";

// Configurar conexão com o banco do Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // obrigatório no Render
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// ============================
// CRIAR TABELAS SE NÃO EXISTIREM
// ============================
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        items JSONB NOT NULL,
        total NUMERIC(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ Tabelas prontas!");
  } catch (err) {
    console.error("Erro ao criar tabelas:", err);
  }
}

// ============================
// ROTAS DE USUÁRIO
// ============================

// Cadastro
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Preencha todos os campos." });

  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashed]);
    res.json({ message: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    if (err.code === "23505") return res.status(400).json({ error: "E-mail já cadastrado." });
    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: "Usuário não encontrado." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Senha incorreta." });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "2h" });
    res.json({ token, userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
});

// ============================
// ROTAS DE PEDIDOS
// ============================

// Criar pedido
app.post("/api/orders/:userId", async (req, res) => {
  const { userId } = req.params;
  const { items, total } = req.body;

  try {
    await pool.query(
      "INSERT INTO orders (user_id, items, total) VALUES ($1, $2, $3)",
      [userId, JSON.stringify(items), total]
    );
    res.json({ message: "Pedido registrado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registrar pedido." });
  }
});

// Listar pedidos do usuário
app.get("/api/orders/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar pedidos." });
  }
});

// ============================
// INICIAR SERVIDOR
// ============================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  initDB();
});  
