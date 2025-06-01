// routes/encomenda_produtos.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todos os produtos em encomendas
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM encomenda_produtos ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET item por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM encomenda_produtos WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Item não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST adicionar produto à encomenda
router.post('/', async (req, res) => {
  const { encomenda_id, produto_id, quantidade, preco_unitario } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO encomenda_produtos (encomenda_id, produto_id, quantidade, preco_unitario) VALUES ($1, $2, $3, $4) RETURNING *',
      [encomenda_id, produto_id, quantidade, preco_unitario]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PUT atualizar item da encomenda
router.put('/:id', async (req, res) => {
  const { quantidade, preco_unitario } = req.body;
  try {
    const result = await db.query(
      'UPDATE encomenda_produtos SET quantidade = $1, preco_unitario = $2 WHERE id = $3 RETURNING *',
      [quantidade, preco_unitario, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Item não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// DELETE remover item da encomenda
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM encomenda_produtos WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Item não encontrado' });
    res.json({ mensagem: 'Item removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
