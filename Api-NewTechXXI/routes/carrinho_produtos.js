// routes/carrinho_produtos.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todos os produtos em carrinhos
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM carrinho_produtos ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET por ID (único item do carrinho)
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM carrinho_produtos WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Item não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST adicionar produto ao carrinho
router.post('/', async (req, res) => {
  const { carrinho_id, produto_id, quantidade } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO carrinho_produtos (carrinho_id, produto_id, quantidade) VALUES ($1, $2, $3) RETURNING *',
      [carrinho_id, produto_id, quantidade]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PUT atualizar quantidade
router.put('/:id', async (req, res) => {
  const { quantidade } = req.body;
  try {
    const result = await db.query(
      'UPDATE carrinho_produtos SET quantidade = $1 WHERE id = $2 RETURNING *',
      [quantidade, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Item não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// DELETE remover item do carrinho
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM carrinho_produtos WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Item não encontrado' });
    res.json({ mensagem: 'Item removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
