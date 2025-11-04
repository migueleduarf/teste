// Importar dependências
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = "applejuice_secret_key"; // depois troque por algo mais seguro

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // pasta com seu site (HTML, CSS, JS)

// Caminhos dos arquivos de dados
const USERS_FILE = "./data/users.json";
const ORDERS_FILE = "./data/orders.json";

// Função auxiliar para ler JSON
function readJSON(file) {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, "utf8"));
}

// Função auxiliar para salvar JSON
function saveJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

//
// ==============================
// ROTA DE CADASTRO DE USUÁRIO
// ==============================
app.post("/api/register", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: "Preencha todos os campos." });

    const users = readJSON(USERS_FILE);
    const userExists = users.find(u => u.email === email);
    if (userExists) return res.status(400).json({ error: "E-mail já cadastrado." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), email, password: hashedPassword, orders: [] };
    users.push(newUser);
    saveJSON(USERS_FILE, users);

    res.json({ message: "Usuário cadastrado com sucesso!" });
});

//
// ==============================
// ROTA DE LOGIN
// ==============================
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const users = readJSON(USERS_FILE);
    const user = users.find(u => u.email === email);

    if (!user) return res.status(400).json({ error: "Usuário não encontrado." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Senha incorreta." });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
});

//
// ==============================
// ROTA PARA PEGAR PEDIDOS DO USUÁRIO
// ==============================
app.get("/api/orders/:userId", (req, res) => {
    const users = readJSON(USERS_FILE);
    const user = users.find(u => u.id == req.params.userId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
    res.json(user.orders);
});

//
// ==============================
// ROTA PARA ADICIONAR PEDIDO
// ==============================
app.post("/api/orders/:userId", (req, res) => {
    const { items, total } = req.body;
    const users = readJSON(USERS_FILE);
    const userIndex = users.findIndex(u => u.id == req.params.userId);
    if (userIndex === -1) return res.status(404).json({ error: "Usuário não encontrado." });

    const newOrder = { id: Date.now(), items, total, date: new Date().toISOString() };
    users[userIndex].orders.push(newOrder);
    saveJSON(USERS_FILE, users);

    res.json({ message: "Pedido adicionado com sucesso!" });
});

//
// ==============================
// INICIAR SERVIDOR
// ==============================
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
