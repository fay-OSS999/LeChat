const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkExpiredMessagesAndRedistribute() {
  const expiredLimit = new Date(Date.now() - 90 * 1000); // 1m30

  const expiredConvos = await prisma.conversation.findMany({
    where: {
      responded: false,
      expired: false,
      assigned_at: { lt: expiredLimit }
    }
  });

  for (const convo of expiredConvos) {
    // 1. Marquer comme expiré
    await prisma.conversation.update({
      where: { id: convo.id },
      data: { expired: true }
    });

    // 2. Chercher un autre agent (sauf l’agent actuel)
          const agentWhere = { role: 'agent' };
          if (convo.agent_id !== null && convo.agent_id !== undefined) {
            agentWhere.id = { not: convo.agent_id };
          }

          const newAgent = await prisma.user.findFirst({
            where: agentWhere,
            orderBy: {
              last_assigned: 'asc' // les moins sollicités en premier
            }
          });

          if (!newAgent) {
            console.log("❌ Aucun agent dispo pour redistribuer.");
            continue;
            }

    // 3. Créer une nouvelle conversation redistribuée
    await prisma.conversation.create({
      data: {
        message_id: convo.message_id,
        client_name: convo.client_name,
        assigned_at: new Date(),
        agent_id: newAgent.id
      }
    });

    // 4. Mettre à jour la date d’assignation
    await prisma.user.update({
      where: { id: newAgent.id },
      data: { last_assigned: new Date() }
    });

    console.log(`✅ Message ${convo.message_id} redistribué à ${newAgent.identifiant}`);
  }
}

module.exports = checkExpiredMessagesAndRedistribute;
