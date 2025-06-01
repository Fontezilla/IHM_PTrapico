const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todas as devoluções
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM devolucoes ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET devolução por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM devolucoes WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Devolução não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST nova devolução
router.post('/', async (req, res) => {
  const { encomenda_produto_id, motivo, imagem_url } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO devolucoes (encomenda_produto_id, motivo, imagem_url)
       VALUES ($1, $2, $3) RETURNING *`,
      [encomenda_produto_id, motivo, imagem_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PUT atualizar estado ou dados da devolução
router.put('/:id', async (req, res) => {
  const { estado, data_aprovacao } = req.body;
  try {
    const result = await db.query(
      'UPDATE devolucoes SET estado = $1, data_aprovacao = $2 WHERE id = $3 RETURNING *',
      [estado, data_aprovacao, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Devolução não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// DELETE cancelar devolução
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM devolucoes WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Devolução não encontrada' });
    res.json({ mensagem: 'Devolução cancelada com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
