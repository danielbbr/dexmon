import express from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { password } = req.body;

  if (password === config.adminPassword) {
    const token = jwt.sign({ username: 'admin' }, config.jwtSecret, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'invalid password' });
  }
});

export default router;