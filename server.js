require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Base de datos conectada exitosamente'))
  .catch((err) => console.error('Error de conexión a la BD:', err));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Servidor ejecutándose en el puerto ' + PORT);
});
