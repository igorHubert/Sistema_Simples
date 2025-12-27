const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 🔹 Criar usuário (CEO ou GERENTE)
exports.create = async (req, res) => {
  const { nome, email, senha, cargo } = req.body;

  const existe = await User.findOne({ email });
  if (existe) {
    return res.status(400).json({ erro: "Usuário já existe" });
  }

  const senhaHash = await bcrypt.hash(senha, 8);

  const user = await User.create({
    nome,
    email,
    senha: senhaHash,
    cargo,
  });

  return res.status(201).json({
    id: user._id,
    nome: user.nome,
    email: user.email,
    cargo: user.cargo,
  });
};

// 🔹 Listar usuários (CEO vê todos / Gerente vê todos funcionários)
exports.list = async (req, res) => {
  const { cargo } = req.user;

  let filtro = {};
  if (cargo === "GERENTE") {
    filtro = { cargo: "FUNCIONARIO" };
  }

  const users = await User.find(filtro).select("-senha");
  return res.json(users);
};

// 🔹 Buscar usuário por ID
exports.findById = async (req, res) => {
  const { id } = req.params;

  // Funcionário só pode ver a si mesmo
  if (req.user.cargo === "FUNCIONARIO" && req.user.id !== id) {
    return res.status(403).json({ erro: "Acesso negado" });
  }

  const user = await User.findById(id).select("-senha");
  if (!user) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }

  return res.json(user);
};

// 🔹 Deletar usuário (somente CEO)
exports.remove = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  return res.status(204).send();
};
