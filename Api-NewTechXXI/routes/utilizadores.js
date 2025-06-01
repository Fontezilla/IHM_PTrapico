// routes/utilizadores.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todos os utilizadores
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM utilizadores ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET utilizador por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM utilizadores WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Utilizador não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST criar novo utilizador
router.post('/', async (req, res) => {
  const { nome, email, password, telefone } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO utilizadores (nome, email, password, telefone) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, email, password, telefone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PUT atualizar utilizador
router.put('/:id', async (req, res) => {
  const { nome, email, password, telefone } = req.body;
  try {
    const result = await db.query(
      'UPDATE utilizadores SET nome = $1, email = $2, password = $3, telefone = $4 WHERE id = $5 RETURNING *',
      [nome, email, password, telefone, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Utilizador não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// DELETE apagar utilizador
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM utilizadores WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Utilizador não encontrado' });
    res.json({ mensagem: 'Utilizador removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST login de utilizador
router.post('/login', async (req, res) => {
  const { identificador, password } = req.body;

  try {
    // Verifica se é email (tem @)
    const isEmail = identificador.includes('@');

    const result = await db.query(
      `SELECT * FROM utilizadores WHERE ${isEmail ? 'email' : 'telefone'} = $1 AND password = $2`,
      [identificador, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const utilizador = result.rows[0];
    res.json({ mensagem: 'Login bem-sucedido', utilizador });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
