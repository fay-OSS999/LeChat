const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post("/auth/login", async (req, res) => {
  const { identifier, password } = req.body;

  const user = await prisma.user.findUnique({ where: { identifier } });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  // Stockage simple (à remplacer + tard par JWT/Session)
  res.cookie("lechat_token", JSON.stringify({ id: user.id, role: user.role }), {
    httpOnly: true,
    sameSite: "Lax",
  });

  res.json({ message: "Connecté", user });
});

router.get('/agent/:agent_id', async (req, res) => {
  const agent_id = parseInt(req.params.agent_id, 10);

  try {
    const agent = await prisma.agent.findUnique({ where: { id: agent_id } });

    if (!agent) {
      return res.status(404).json({ message: 'Agent non trouvé' });
    }

    return res.json(agent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
