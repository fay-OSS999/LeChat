const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
  const { id, password } = req.body;

  try {
    // Correction ici : utilise identifier
    const user = await prisma.user.findUnique({ where: { identifier: id } });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Identifiant ou mot de passe invalide' });
    }

    // Création d'une session simple
    res.cookie('lechat_token', JSON.stringify({ id: user.id, role: user.role }), {
      httpOnly: false, // <-- DOIT être false pour accès JS
      sameSite: 'lax',
      maxAge: 3600000, // 1h
    });

    // Ajoute ce cookie pour la redirection automatique côté frontend
    res.cookie('lechat-role', user.role, {
      httpOnly: false, // accessible côté client
      sameSite: 'lax',
      maxAge: 3600000, // 1h
    });

    return res.json({ message: 'Connexion réussie', role: user.role });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
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
