"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import StatsModal from "@/components/StatsModal";

type Message = {
  id: number;
  message_id: string;
  agent_id: number;
  content: string;
  assigned_at: string;
  responded: boolean;
  expired: boolean;
};

function getAgentIdFromCookie() {
  const match = document.cookie.match(/(?:^|;\s*)lechat_token=([^;]*)/);
  if (!match) return null;
  try {
    let decoded = decodeURIComponent(match[1]);
    if (decoded.startsWith('%7B')) {
      decoded = decodeURIComponent(decoded);
    }
    const parsed = JSON.parse(decoded);
    return typeof parsed.id === "number" ? parsed.id : Number(parsed.id);
  } catch (e) {
    console.error("Erreur de décodage du cookie :", e, match[1]);
    return null;
  }
}

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [agentId, setAgentId] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(90);
  const [showStats, setShowStats] = useState(false);

  // Récupère l'agentId au montage
  useEffect(() => {
    const id = getAgentIdFromCookie();
    console.log("Agent ID récupéré du cookie :", id);
    setAgentId(id);
  }, []);

  // Récupère les messages quand agentId est dispo
  useEffect(() => {
    console.log("agentId dans useEffect messages :", agentId);
    if (agentId === null) return;
    fetch(`http://localhost:3001/api/messages/${agentId}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        console.log("Messages reçus :", data);
        setMessages(data.messages || []);
      })
      .catch(err => console.error('Erreur lors du chargement des messages:', err));
  }, [agentId]);

  async function sendMessage() {
    console.log("Tentative d'envoi :", { agentId, message });
    if (!agentId || !message.trim()) return;
    const res = await fetch('http://localhost:3001/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
      credentials: 'include'
    });
    const data = await res.json();
    console.log("Réponse à l'envoi :", data);
    setMessage('');
    fetch(`http://localhost:3001/api/messages/${agentId}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setMessages(data.messages || []));
  }

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${('0' + (s % 60)).slice(-2)}`;

  const handleLogout = async () => {
  await fetch('/api/logout', { method: 'POST' });
  window.location.href = '/login'; // redirige vers la page de connexion
};


  return (
    
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      
      <header className="bg-white shadow px-6 py-2 flex items-center justify-start">
        <h1 className="text-2xl font-bold text-pink-600 tracking-tight mr-4 ml-2">LeChat</h1>
        <nav className="ml-auto space-x-6">
          <a href="#" className="text-gray-700 font-medium">Chats</a>
          <button onClick={() => setShowStats(true)} className="text-gray-700 font-medium">Statistiques</button>
                <button
          onClick={async () => {
            await fetch('/api/logout'); // Supprime le cookie
            window.location.href = '/login'; // Redirection
          }}
          className="text-red-600 hover:underline ml-4"
        >
          Déconnexion
        </button>

        </nav>
      </header>

      {/* Main */}
      <main className="grid grid-cols-12 gap-6 p-6">
        {/* Colonne gauche (Client) */}
        <div className="col-span-3 bg-white rounded-xl shadow p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-green-700 mb-2">Client</h2>
            <div className="text-sm text-gray-600">Autres renseignements</div>
            <div className="h-24 bg-gray-100 rounded mb-2" />
            <div className="text-sm text-gray-600">Description</div>
            <div className="h-24 bg-gray-100 rounded mb-2" />
            <div className="text-sm text-gray-600">Nom</div>
            <div className="h-6 bg-gray-100 rounded mb-2" />
            <div className="text-sm text-gray-600">Âge</div>
            <div className="h-6 bg-gray-100 rounded mb-2" />
            <p className="text-xs text-red-500">Veuillez saisir l'âge du client</p>
            <div className="text-sm text-gray-600">Chat Preference</div>
            <div className="h-6 bg-gray-100 rounded mb-2" />
            <div className="text-sm text-gray-600">Sexe</div>
            <div className="flex items-center gap-4 text-sm">
              <label><input type="radio" name="sex" /> Femelle</label>
              <label><input type="radio" name="sex" /> Mâle</label>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Logbook</h3>
            <textarea className="w-full h-20 p-2 border border-gray-300 rounded text-sm" placeholder="Ajouter une remarque..." />
            <Button className="mt-2 w-full bg-green-600 text-white">Enregistrer</Button>
          </div>
        </div>

        {/* Centre (Zone de message) */}
        <div className="col-span-6 bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Envoyer un message</h2>
              <div className="text-sm font-bold bg-red-100 text-red-700 px-4 py-1 rounded-full animate-pulse shadow-sm">
                Temps restant : {formatTime(timeLeft)}
              </div>
            </div>
            <form onSubmit={e => {
  e.preventDefault();
  sendMessage();
}}>
  <textarea
    className="w-full h-28 p-3 border border-gray-300 rounded mb-3"
    placeholder="Votre message..."
    value={message}
    onChange={e => setMessage(e.target.value)}
  />
  <div className="flex justify-between">
    <Button variant="destructive">Salle de panique</Button>
    <Button
      className="bg-purple-600 hover:bg-purple-700 text-white"
      type="submit"
    >
      Envoyer le message
    </Button>
  </div>
</form>
          </div>

          <div className="border-t pt-3 text-center text-gray-500 italic text-sm">Ancien historique</div>
          <div className="h-32 bg-gray-100 mt-2 rounded"></div>

          {/* Liste des messages */}
          <div className="mt-4">
            <h2 className="font-bold">Messages :</h2>
            <ul className="mt-2 text-sm">
              {messages.length > 0 ? (
                messages.map((msg, idx) => (
                  <li key={idx}>{msg.content}</li>
                ))
              ) : (
                <li>Aucun message</li>
              )}
            </ul>
          </div>
        </div>

        {/* Colonne droite (Modérateur) */}
        <div className="col-span-3 bg-white rounded-xl shadow p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-green-700 mb-2">Modérateur</h2>
            <div className="text-sm text-gray-600">Autres renseignements</div>
            <div className="h-24 bg-gray-100 rounded mb-2" />
            <div className="text-sm text-gray-600">Description</div>
            <div className="h-24 bg-gray-100 rounded mb-2" />
            <div className="text-sm text-gray-600">Nom</div>
            <div className="h-6 bg-gray-100 rounded mb-2" />
            <div className="text-sm text-gray-600">Âge</div>
            <div className="h-6 bg-gray-100 rounded mb-2" />
            <div className="text-sm text-gray-600">Chat Preference</div>
            <div className="h-6 bg-gray-100 rounded mb-2" />
            <div className="text-sm text-gray-600">Sexe</div>
            <div className="flex items-center gap-4 text-sm">
              <label><input type="radio" name="sex2" /> Femelle</label>
              <label><input type="radio" name="sex2" /> Mâle</label>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Logbook</h3>
            <textarea className="w-full h-20 p-2 border border-gray-300 rounded text-sm" placeholder="Ajouter une remarque..." />
            <Button className="mt-2 w-full bg-green-600 text-white">Enregistrer</Button>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showStats && <StatsModal onClose={() => setShowStats(false)} />}

      {/* Erreur agentId */}
      {agentId === null && (
  <div className="text-red-500 text-center">
    Erreur : impossible de récupérer l’identifiant agent. Veuillez vous reconnecter.
  </div>
)}
    </div>
  );
}
