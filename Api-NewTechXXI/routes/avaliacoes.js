const express = require('express');
const router  = express.Router();
const db      = require('../db');

/* ---------------------------------------------------------------
   GET /avaliacoes
   ?produto_id=123  -> só desse produto
   (vazio)          -> todas as avaliações
   Devolve também userName (JOIN com tabela utilizadores)
---------------------------------------------------------------- */
router.get('/', async (req, res) => {
  try {
    const { produto_id } = req.query;

    // SQL base com JOIN
    let sql = `
      SELECT a.id, a.produto_id, a.utilizador_id,
             a.pontuacao, a.comentario,
             a.data_avaliacao       AS "date",
             u.nome        AS "userName"
      FROM   avaliacoes a
      JOIN   utilizadores u ON u.id = a.utilizador_id
    `;
    const params = [];

    if (produto_id) {
      params.push(produto_id);
      sql += ` WHERE a.produto_id = $1`;
    }

    sql += ` ORDER BY a.id`;

    const result = await db.query(sql, params);
    res.json(result.rows);

  } catch (err) {
    console.error('Erro ao buscar avaliações:', err);
    res.status(500).json({ erro: err.message });
  }
});

/* ---------------------------------------------------------------
   GET /avaliacoes/:id
---------------------------------------------------------------- */
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.id, a.produto_id, a.utilizador_id,
              a.pontuacao, a.comentario,
              a.data_avaliacao     AS "date",
              u.nome       AS "userName"
       FROM   avaliacoes a
       JOIN   utilizadores u ON u.id = a.utilizador_id
       WHERE  a.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Avaliação não encontrada' });
    }
    res.json(result.rows[0]);

  } catch (err) {
    console.error('Erro ao buscar avaliação por ID:', err);
    res.status(500).json({ erro: err.message });
  }
});

/* ---------------------------------------------------------------
   POST /avaliacoes
---------------------------------------------------------------- */
router.post('/', async (req, res) => {
  const { produto_id, utilizador_id, pontuacao, comentario } = req.body;
  try {
    const insert = await db.query(
      `INSERT INTO avaliacoes
         (produto_id, utilizador_id, pontuacao, comentario)
       VALUES ($1, $2, $3, $4)
       RETURNING id, produto_id, utilizador_id,
                 pontuacao, comentario,
                 data_avaliacao AS "date"`,
      [produto_id, utilizador_id, pontuacao, comentario]
    );

    const novaAval = insert.rows[0];

    const user = await db.query(
      'SELECT nome FROM utilizadores WHERE id = $1',
      [utilizador_id]
    );

    res.status(201).json({
      ...novaAval,
      userName: user.rows[0]?.nome ?? 'Desconhecido'
    });

  } catch (err) {
    console.error('Erro ao criar avaliação:', err);
    res.status(500).json({ erro: err.message });
  }
});

/* ---------------------------------------------------------------
   PUT /avaliacoes/:id
---------------------------------------------------------------- */
router.put('/:id', async (req, res) => {
  const { pontuacao, comentario } = req.body;
  try {
    const update = await db.query(
      `UPDATE avaliacoes
          SET pontuacao = $1,
              comentario = $2
        WHERE id = $3
      RETURNING id, produto_id, utilizador_id,
                pontuacao, comentario,
                data_avaliacao AS "date"`,
      [pontuacao, comentario, req.params.id]
    );

    if (!update.rows.length) {
      return res.status(404).json({ erro: 'Avaliação não encontrada' });
    }

    const aval = update.rows[0];
    const user = await db.query(
      'SELECT nome FROM utilizadores WHERE id = $1',
      [aval.utilizador_id]
    );

    res.json({
      ...aval,
      userName: user.rows[0]?.nome ?? 'Desconhecido'
    });

  } catch (err) {
    console.error('Erro ao atualizar avaliação:', err);
    res.status(500).json({ erro: err.message });
  }
});

/* ---------------------------------------------------------------
   DELETE /avaliacoes/:id
---------------------------------------------------------------- */
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM avaliacoes WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ erro: 'Avaliação não encontrada' });
    }
    res.json({ mensagem: 'Avaliação removida com sucesso' });

  } catch (err) {
    console.error('Erro ao apagar avaliação:', err);
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
