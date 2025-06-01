// routes/faturas.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Função auxiliar para gerar número de fatura
function gerarNumeroFatura(id) {
  const ano = new Date().getFullYear();
  return `FT-${ano}-${String(id).padStart(4, '0')}`;
}

// GET todas as faturas
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM faturas ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET fatura por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM faturas WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Fatura não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST emitir fatura para encomenda
router.post('/', async (req, res) => {
  const { encomenda_id } = req.body;

  try {
    // Verifica se já existe fatura para esta encomenda
    const check = await db.query('SELECT * FROM faturas WHERE encomenda_id = $1', [encomenda_id]);
    if (check.rows.length > 0) {
      return res.status(400).json({ erro: 'Fatura já emitida para esta encomenda' });
    }

    // Cria fatura sem número
    const nova = await db.query(
      'INSERT INTO faturas (encomenda_id) VALUES ($1) RETURNING *',
      [encomenda_id]
    );

    const numero = gerarNumeroFatura(nova.rows[0].id);

    // Atualiza com número gerado
    const atualizada = await db.query(
      'UPDATE faturas SET numero = $1 WHERE id = $2 RETURNING *',
      [numero, nova.rows[0].id]
    );

    res.status(201).json(atualizada.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// DELETE (apenas para fins académicos)
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM faturas WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Fatura não encontrada' });
    res.json({ mensagem: 'Fatura removida (simulação)' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
