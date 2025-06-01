const express = require('express');
const cors = require('cors');
const os = require('os');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
const utilizadoresRoute = require('./routes/utilizadores');
const produtosRoute = require('./routes/produtos');
const categoriasRoute = require('./routes/categorias');
const moradasRoute = require('./routes/moradas');
const carrinhosRoute = require('./routes/carrinhos');
const carrinhoProdutosRoute = require('./routes/carrinho_produtos');
const encomendasRoute = require('./routes/encomendas');
const encomendaProdutosRoute = require('./routes/encomenda_produtos');
const pagamentosRoute = require('./routes/pagamentos');
const avaliacoesRoute = require('./routes/avaliacoes');
const favoritosRoute = require('./routes/favoritos');
const devolucoesRoute = require('./routes/devolucoes');
const faturasRoute = require('./routes/faturas');

// Usar rotas
app.use('/utilizadores', utilizadoresRoute);
app.use('/produtos', produtosRoute);
app.use('/categorias', categoriasRoute);
app.use('/moradas', moradasRoute);
app.use('/carrinhos', carrinhosRoute);
app.use('/carrinho-produtos', carrinhoProdutosRoute);
app.use('/encomendas', encomendasRoute);
app.use('/encomenda-produtos', encomendaProdutosRoute);
app.use('/pagamentos', pagamentosRoute);
app.use('/avaliacoes', avaliacoesRoute);
app.use('/favoritos', favoritosRoute);
app.use('/devolucoes', devolucoesRoute);
app.use('/faturas', faturasRoute);

function getLocalIPv4Address() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (
        config.family === 'IPv4' &&
        !config.internal &&
        (config.address.startsWith('192.') || config.address.startsWith('10.') || config.address.startsWith('172.'))
      ) {
        return config.address;
      }
    }
  }
  return 'localhost';
}

app.get('/ping', (req, res) => {
  res.send('pong');
});

const PORT = 3000;
const IP = '0.0.0.0';

app.listen(PORT, IP, () => {
  const ipLocal = getLocalIPv4Address();
  console.log(`✅ API disponível:
  → Localhost: http://localhost:${PORT}
  → Rede local: http://${ipLocal}:${PORT}`);
});

