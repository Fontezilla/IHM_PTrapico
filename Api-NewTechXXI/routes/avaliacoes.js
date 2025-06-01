// routes/avaliacoes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todas as avaliações
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM avaliacoes ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET avaliação por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM avaliacoes WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Avaliação não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST criar nova avaliação
router.post('/', async (req, res) => {
  const { produto_id, utilizador_id, pontuacao, comentario } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO avaliacoes (produto_id, utilizador_id, pontuacao, comentario) VALUES ($1, $2, $3, $4) RETURNING *',
      [produto_id, utilizador_id, pontuacao, comentario]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PUT atualizar avaliação
router.put('/:id', async (req, res) => {
  const { pontuacao, comentario } = req.body;
  try {
    const result = await db.query(
      'UPDATE avaliacoes SET pontuacao = $1, comentario = $2 WHERE id = $3 RETURNING *',
      [pontuacao, comentario, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Avaliação não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// DELETE apagar avaliação
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM avaliacoes WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Avaliação não encontrada' });
    res.json({ mensagem: 'Avaliação removida com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
