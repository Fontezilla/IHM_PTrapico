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

// GET produtos de encomendas recentes de um utilizador (últimos 15 dias)
router.get('/encomendas-recentes/:utilizadorId', async (req, res) => {
  const utilizadorId = req.params.utilizadorId;

  try {
    // Encomendas do utilizador nos últimos 15 dias
    const encomendasQuery = `
      SELECT * FROM encomendas
      WHERE utilizador_id = $1
        AND data >= CURRENT_DATE - INTERVAL '15 days'
    `;
    const encomendasResult = await db.query(encomendasQuery, [utilizadorId]);

    const encomendas = encomendasResult.rows;

    if (encomendas.length === 0) {
      return res.json([]); // Sem compras recentes
    }

    // Obter IDs das encomendas
    const encomendaIds = encomendas.map(e => e.id);

    // Buscar os produtos dessas encomendas com JOIN ao produto
    const produtosQuery = `
      SELECT ep.produto_id, ep.quantidade, ep.preco_unitario,
             p.descricao AS nome, p.preco, p.imagem
      FROM encomenda_produtos ep
      JOIN produtos p ON ep.produto_id = p.id
      WHERE ep.encomenda_id = ANY($1)
    `;
    const produtosResult = await db.query(produtosQuery, [encomendaIds]);

    res.json(produtosResult.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


// POST criar nova encomenda
router.post('/', async (req, res) => {
  const { utilizador_id, morada_id, estado, total, local_entrega, loja_morada } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO encomendas (utilizador_id, morada_id, estado, total, local_entrega, loja_morada) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [utilizador_id, morada_id, estado || 'Pendente', total, local_entrega, loja_morada]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PUT atualizar encomenda
router.put('/:id', async (req, res) => {
  const { utilizador_id, morada_id, estado, total, local_entrega, loja_morada } = req.body;
  try {
    const result = await db.query(
      'UPDATE encomendas SET utilizador_id = $1, morada_id = $2, estado = $3, total = $4, local_entrega = $5, loja_morada = $6 WHERE id = $7 RETURNING *',
      [utilizador_id, morada_id, estado, total, local_entrega, loja_morada, req.params.id]
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
