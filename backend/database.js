const mysql = require('mysql2');


    const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'localcivilregistry'
  });

  connection.on('connect', () => {
    console.log('Connected to MySQL database');
  });
  
  connection.on('error', (err) => {
    console.error('Error connecting to MySQL database:', err);
  });

  module.exports = connection;