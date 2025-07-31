const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post("/incoming", async (req, res) => {
  const { client_name } = req.body;
  if (!client_name) return res.status(400).json({ error: "Nom client requis" });

  const agent = await prisma.user.findFirst({ where: { role: "agent" } });
  if (!agent) return res.status(503).json({ error: "Aucun agent disponible" });

  const conversation = await prisma.conversation.create({
    data: {
      message_id: `msg_${Date.now()}`,
      client_name,
      agent_id: agent.id,
      assigned_at: new Date(),
    },
  });

  await prisma.message.create({
    data: {
      conversation_id: conversation.id,
      message_id: conversation.message_id,
      agent_id: agent.id,
      content: "",
      assigned_at: new Date(),
      responded: false,
      expired: false,
    },
  });

  res.status(201).json({ message: "Conversation créée", conversation });
});

module.exports = router;
