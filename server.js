// server.js
// Backend para e-commerce Apple Juice
// PostgreSQL + Express + JWT Auth

import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Banco de dados PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Criar tabelas se não existirem
async function initDB() {
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );`);

  await pool.query(`CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    cart JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);
}
initDB();

// Middleware de autenticação
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: "Token inválido" });
  }
}

// Criar conta
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(`INSERT INTO users(email, password) VALUES($1,$2)`, [email, hashed]);
    res.json({ message: "Usuário criado" });
  } catch {
    res.status(400).json({ error: "Email já cadastrado" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);

  if (!rows.length) return res.status(400).json({ error: "Usuário não encontrado" });

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Senha incorreta" });

  const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET);
  res.json({ token });
});

// Salvar compra
app.post("/orders", auth, async (req, res) => {
  const { cart } = req.body;
  await pool.query(`INSERT INTO orders(user_id, cart) VALUES($1,$2)`, [req.user.id, cart]);
  res.json({ message: "Compra registrada" });
});

// Histórico de compras
app.get("/orders", auth, async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC`, [req.user.id]);
  res.json(rows);
});

// Inicializar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
