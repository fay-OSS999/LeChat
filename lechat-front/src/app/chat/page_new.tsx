'use client';

import { useEffect, useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const token = document.cookie
      .split(';')
      .map(c => c.trim())
      .find(c => c.startsWith('lechat_token='));
    if (!token) return;
    const payload = JSON.parse(decodeURIComponent(token.split('=')[1]));
    const agentId = payload.id;

    fetch(`http://localhost:3001/api/messages/${agentId}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setMessages(data.messages))
      .catch(err => console.error("Erreur chargement messages:", err));
  }, []);

  return (
    <main className="p-4">
      <h2 className="text-xl font-semibold mb-2">Messages assignés</h2>
      <ul className="space-y-2">
        {messages.map((msg: any) => (
          <li key={msg.id} className="border p-2">
            <p className="text-sm text-gray-600">{msg.assigned_at}</p>
            <p>{msg.content || '...'}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
