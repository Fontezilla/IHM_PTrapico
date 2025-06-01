// routes/categorias.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todas as categorias
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categorias ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET categoria por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categorias WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Categoria não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST criar nova categoria
router.post('/', async (req, res) => {
  const { nome } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO categorias (nome) VALUES ($1) RETURNING *',
      [nome]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PUT atualizar categoria
router.put('/:id', async (req, res) => {
  const { nome } = req.body;
  try {
    const result = await db.query(
      'UPDATE categorias SET nome = $1 WHERE id = $2 RETURNING *',
      [nome, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Categoria não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// DELETE apagar categoria
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM categorias WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Categoria não encontrada' });
    res.json({ mensagem: 'Categoria removida com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
