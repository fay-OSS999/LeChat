const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 🔹 POST /api/messages - enregistrer un nouveau message
router.post('/', async (req, res) => {
  const { content } = req.body;
  try {
    const token = req.cookies.lechat_token;
    if (!token) return res.status(401).json({ message: "Non authentifié" });

    const { id: agent_id } = JSON.parse(token);

    const newMessage = await prisma.message.create({
      data: {
        message_id: `msg_${Date.now()}`,
        agent_id,
        content,
        assigned_at: new Date(),
      },
    });

    res.json({ message: 'Message enregistré', data: newMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de l’enregistrement' });
  }
});

// 🔹 GET /api/messages/:agent_id - liste des messages pour un agent
router.get('/:agent_id', async (req, res) => {
  const { agent_id } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: { agent_id: parseInt(agent_id, 10) },
      orderBy: { assigned_at: 'desc' },
    });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
});

module.exports = router;

