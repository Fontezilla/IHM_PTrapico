const { Pool } = require('pg');

const pool = new Pool({
  user: 'api_user',         
  host: 'localhost',          
  database: 'NewTechXXI',
  password: 'senha123',       
  port: 5432
});

module.exports = pool;