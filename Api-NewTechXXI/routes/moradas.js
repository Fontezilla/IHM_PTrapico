// routes/moradas.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todas as moradas
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM moradas ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET morada por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM moradas WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Morada não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET todas as moradas de um utilizador
router.get('/utilizador/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM moradas WHERE utilizador_id = $1 ORDER BY id', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST nova morada
router.post('/', async (req, res) => {
  const { utilizador_id, rua, cidade, codigo_postal, pais } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO moradas (utilizador_id, rua, cidade, codigo_postal, pais)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [utilizador_id, rua, cidade, codigo_postal, pais]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PUT atualizar morada
router.put('/:id', async (req, res) => {
  const { rua, cidade, codigo_postal, pais } = req.body;
  try {
    const result = await db.query(
      `UPDATE moradas
       SET rua = $1, cidade = $2, codigo_postal = $3, pais = $4
       WHERE id = $5 RETURNING *`,
      [rua, cidade, codigo_postal, pais, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Morada não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// DELETE morada
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM moradas WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Morada não encontrada' });
    res.json({ mensagem: 'Morada removida com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
