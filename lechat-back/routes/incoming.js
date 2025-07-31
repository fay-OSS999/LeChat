const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  try {
    const { client_name } = req.body;

    if (!client_name) {
      return res.status(400).json({ message: 'Le nom du client est requis' });
    }

    const availableAgent = await prisma.user.findFirst({ where: { role: 'agent' } });
    if (!availableAgent) return res.status(503).json({ message: 'Aucun agent disponible' });

    const conversation = await prisma.conversation.create({
      data: {
        client_name,
        message_id: `msg_${Date.now()}`,
        agent_id: availableAgent.id,
        assigned_at: new Date(),
      },
    });

    const message = await prisma.message.create({
      data: {
        conversation_id: conversation.id,
        message_id: conversation.message_id,
        agent_id: availableAgent.id,
        content: '',
        assigned_at: new Date(),
        responded: false,
        expired: false,
      },
    });

    res.status(201).json({
      message: 'Conversation et message initial créés',
      conversation,
      message,
    });

  } catch (err) {
    console.error('Erreur dans /incoming :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
