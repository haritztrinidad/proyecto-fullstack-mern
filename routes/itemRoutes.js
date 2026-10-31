const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Item = require('../models/Item');

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Token requerido' });
  
  const bearer = token.split(' ')[1];
  jwt.verify(bearer, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.userId = decoded.id;
    next();
  });
};

// Obtener elementos del usuario
router.get('/', verifyToken, async (req, res) => {
  try {
    const items = await Item.find({ user: req.userId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener elementos' });
  }
});

// Crear elemento
router.post('/', verifyToken, async (req, res) => {
  try {
    const newItem = new Item({ name: req.body.name, user: req.userId });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear elemento' });
  }
});

// Eliminar elemento
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Item.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ mensaje: 'Elemento eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar elemento' });
  }
});

module.exports = router;
