// routes/carrinhos.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todos os carrinhos
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM carrinhos ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET carrinho por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM carrinhos WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Carrinho não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST criar carrinho (1 por utilizador)
router.post('/', async (req, res) => {
  const { utilizador_id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO carrinhos (utilizador_id) VALUES ($1) RETURNING *',
      [utilizador_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ erro: 'Utilizador já possui um carrinho' });
    } else {
      res.status(500).json({ erro: err.message });
    }
  }
});

// PUT atualizar (pouco comum, mas possível)
router.put('/:id', async (req, res) => {
  const { utilizador_id } = req.body;
  try {
    const result = await db.query(
      'UPDATE carrinhos SET utilizador_id = $1 WHERE id = $2 RETURNING *',
      [utilizador_id, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Carrinho não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// DELETE apagar carrinho
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM carrinhos WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Carrinho não encontrado' });
    res.json({ mensagem: 'Carrinho removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
