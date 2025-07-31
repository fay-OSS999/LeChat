// pages/waiting.tsx
"use client" ;
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";


const messages = [
  "Connexion au serveur...",
  "Recherche de nouveaux messages...",
  "Aucune session active...",
  "En attente de la prochaine session..."
];

export default function WaitingPage() {
  const [loadingMessage, setLoadingMessage] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingMessage((prev) => {
        const index = messages.indexOf(prev);
        return messages[(index + 1) % messages.length];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
 <header className="bg-white shadow px-6 py-2 flex items-center justify-start">
        <h1 className="text-2xl font-bold text-pink-600 tracking-tight mr-4 ml-2">LeChat</h1>
        <nav className="ml-auto space-x-6">
          <a href="#" className="text-gray-700 font-medium">Chats</a>
          <a href="#" className="text-gray-700 font-medium">Statistiques</a>
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
        <div className="col-span-3 bg-white rounded-xl shadow p-4">
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

        {/* Centre (En attente) */}
        <div className="col-span-6 flex flex-col justify-center items-center text-center bg-white rounded-xl shadow p-10">
          <h2 className="text-lg font-semibold mb-6">{loadingMessage}</h2>
          <div className="w-12 h-12 border-4 border-purple-400 border-dashed rounded-full animate-spin"></div>
        </div>

        {/* Colonne droite (Modérateur) */}
        <div className="col-span-3 bg-white rounded-xl shadow p-4">
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
      </main>
    </div>
  );
}
