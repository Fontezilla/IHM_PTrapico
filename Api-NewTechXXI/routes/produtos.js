// routes/produtos.js
const express = require('express');
const multer  = require('multer');
const db      = require('../db');
const router  = express.Router();

// Multer em memória para captar o buffer da imagem
const storage = multer.memoryStorage();
const upload  = multer({ storage });

// Campos comuns de SELECT (sem a coluna imagem_bytea)
const baseSelect = `
  SELECT
    id,
    nome         AS name,
    preco        AS price,
    preco_antigo AS oldPrice,
    marca        AS brand,
    stock,
    destaque,
    descricao    AS description,
    categoria_id AS "categoryId"
  FROM produtos
`;

// GET todos os produtos
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`${baseSelect} ORDER BY id`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET produtos em destaque
router.get('/featured', async (req, res) => {
  try {
    const result = await db.query(
      `${baseSelect} WHERE destaque = true ORDER BY id`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET produto por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      `${baseSelect} WHERE id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET imagem do produto (BYTEA)
router.get('/:id/imagem', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT imagem FROM produtos WHERE id = $1',
      [req.params.id]
    );
    if (!result.rows.length || !result.rows[0].imagem)
      return res.status(404).end();
    res.type('png').send(result.rows[0].imagem);
  } catch (err) {
    res.status(500).end();
  }
});

// POST criar novo produto (+ imagem)
router.post('/', upload.single('image'), async (req, res) => {
  const {
    nome, preco, descricao,
    categoria_id, marca, stock, destaque
  } = req.body;
  const imageBuffer = req.file ? req.file.buffer : null;

  try {
    const result = await db.query(
      `
      INSERT INTO produtos
        (nome, preco, preco_antigo, marca, stock,
         destaque, descricao, categoria_id, imagem)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
      `,
      [
        nome,
        preco,
        req.body.preco_antigo || null,
        marca,
        stock,
        destaque === 'true' || destaque === true,
        descricao,
        categoria_id,
        imageBuffer
      ]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PUT atualizar produto (+ imagem opcional)
router.put('/:id', upload.single('image'), async (req, res) => {
  const {
    nome, preco, descricao,
    categoria_id, marca, stock, destaque
  } = req.body;
  const imageBuffer = req.file ? req.file.buffer : null;

  // Monta dinamicamente o SET para incluir ou não o campo imagem
  const fields = [
    'nome = $1',
    'preco = $2',
    'preco_antigo = $3',
    'marca = $4',
    'stock = $5',
    'destaque = $6',
    'descricao = $7',
    'categoria_id = $8'
  ];
  const values = [
    nome,
    preco,
    req.body.preco_antigo || null,
    marca,
    stock,
    destaque === 'true' || destaque === true,
    descricao,
    categoria_id
  ];

  if (imageBuffer) {
    fields.push('imagem = $9');
    values.push(imageBuffer);
  }
  // id é o último parâmetro
  values.push(req.params.id);

  try {
    const result = await db.query(
      `UPDATE produtos
         SET ${fields.join(', ')}
       WHERE id = $${values.length}
       RETURNING id`,
      values
    );
    if (!result.rows.length)
      return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// DELETE apagar produto
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM produtos WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json({ mensagem: 'Produto removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
