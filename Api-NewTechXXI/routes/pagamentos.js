// routes/pagamentos.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todos os pagamentos
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM pagamentos ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET pagamento por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM pagamentos WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Pagamento não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST criar novo pagamento
router.post('/', async (req, res) => {
  const { encomenda_id, metodo, estado } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO pagamentos (encomenda_id, metodo, estado) VALUES ($1, $2, $3) RETURNING *',
      [encomenda_id, metodo, estado || 'Pendente']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PUT atualizar pagamento
router.put('/:id', async (req, res) => {
  const { encomenda_id, metodo, estado } = req.body;
  try {
    const result = await db.query(
      'UPDATE pagamentos SET encomenda_id = $1, metodo = $2, estado = $3 WHERE id = $4 RETURNING *',
      [encomenda_id, metodo, estado, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Pagamento não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// DELETE apagar pagamento
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM pagamentos WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Pagamento não encontrado' });
    res.json({ mensagem: 'Pagamento removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
