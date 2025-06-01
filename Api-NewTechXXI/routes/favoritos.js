// routes/favoritos.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todos os favoritos
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM favoritos ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET favorito por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM favoritos WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Favorito não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST adicionar produto aos favoritos
router.post('/', async (req, res) => {
  const { utilizador_id, produto_id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO favoritos (utilizador_id, produto_id) VALUES ($1, $2) RETURNING *',
      [utilizador_id, produto_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ erro: 'Produto já está nos favoritos deste utilizador' });
    } else {
      res.status(500).json({ erro: err.message });
    }
  }
});

// DELETE remover dos favoritos
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM favoritos WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Favorito não encontrado' });
    res.json({ mensagem: 'Removido dos favoritos com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
