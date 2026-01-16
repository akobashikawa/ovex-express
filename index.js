const express = require('express');
const app = express();
const PORT = 3000;

// Endpoint Hello World
app.get('/helloworld', (req, res) => {
  res.send('Hello World!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Endpoint disponible en http://localhost:${PORT}/helloworld`);
});
