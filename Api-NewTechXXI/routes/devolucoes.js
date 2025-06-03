const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const upload = multer(); // armazena ficheiros em memória

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

// POST nova devolução (com imagem e fatura como ficheiros)
router.post('/', upload.fields([
  { name: 'imagem_url' },
  { name: 'fatura_url' }
]), async (req, res) => {
  try {
    // DEBUG: Mostra o que está a chegar do frontend
    console.log('[DEBUG] req.body:', req.body);
    console.log('[DEBUG] req.files:', req.files);

    const { motivo, produto_id } = req.body;

    const imagemBuffer = req.files?.imagem_url?.[0]?.buffer || null;
    const faturaBuffer = req.files?.fatura_url?.[0]?.buffer || null;

    if (!motivo || !produto_id || !imagemBuffer) {
      console.warn('[WARN] Campos obrigatórios em falta.');
      return res.status(400).json({ erro: 'Campos obrigatórios em falta.' });
    }

    const result = await db.query(
      `INSERT INTO devolucoes (
         motivo,
         produto_id,
         imagem,
         fatura
       ) VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [motivo, produto_id, imagemBuffer, faturaBuffer]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[ERRO DEVOLUÇÃO]', err);
    res.status(500).json({ erro: err.message });
  }
});

// PUT atualizar estado ou data_aprovacao
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
