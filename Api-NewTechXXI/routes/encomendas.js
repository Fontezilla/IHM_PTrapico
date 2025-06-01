// routes/encomendas.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todas as encomendas
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM encomendas ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET encomenda por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM encomendas WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Encomenda não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST criar nova encomenda
router.post('/', async (req, res) => {
  const { utilizador_id, morada_id, estado, total } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO encomendas (utilizador_id, morada_id, estado, total) VALUES ($1, $2, $3, $4) RETURNING *',
      [utilizador_id, morada_id, estado || 'Pendente', total]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PUT atualizar encomenda
router.put('/:id', async (req, res) => {
  const { utilizador_id, morada_id, estado, total } = req.body;
  try {
    const result = await db.query(
      'UPDATE encomendas SET utilizador_id = $1, morada_id = $2, estado = $3, total = $4 WHERE id = $5 RETURNING *',
      [utilizador_id, morada_id, estado, total, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Encomenda não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// DELETE apagar encomenda
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM encomendas WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Encomenda não encontrada' });
    res.json({ mensagem: 'Encomenda removida com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
