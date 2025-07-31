const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const messagesRoutes = require('./routes/messages');
const incomingRoutes = require('./routes/incoming');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes montées
app.use('/api/auth', authRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/incoming', incomingRoutes);

// Test de base de données
async function test() {
  const users = await prisma.user.findMany();
  console.log(users);
}
test();

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Backend démarré sur http://localhost:${PORT}`);
});

const checkExpiredMessagesAndRedistribute = require('./messageWatcher');
setInterval(() => {
  checkExpiredMessagesAndRedistribute();
}, 30000);
