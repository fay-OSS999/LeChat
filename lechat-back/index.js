const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { PrismaClient } = require("@prisma/client");

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const incomingRoutes = require("./routes/incoming");

const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", authRoutes);
app.use("/api", messageRoutes);
app.use("/api", incomingRoutes);

// Démarrage
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
