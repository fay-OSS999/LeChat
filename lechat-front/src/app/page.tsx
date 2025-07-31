'use client';

import { useState } from 'react';
import { Lock, User } from 'lucide-react';

export default function npLoginPage() {
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const regex = /^(\d{3}_(fr|de|en)|\d{3}_admin_(fr|de|en)|Su_\d{3})$/i;
    if (!regex.test(identifiant)) {
      setError('Identifiant invalide');
      return;
    }

    if (password.length < 6) {
      setError('Mot de passe trop court');
      return;
    }

    console.log('Connexion avec', identifiant, password);
    // 🔐 future API call
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/img/logo.svg" alt="Logo LeChat" className="w-14 h-14 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Connexion à LeChat</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white">
            <User className="mr-2 text-gray-400" />
            <input
              type="text"
              placeholder="Identifiant"
              value={identifiant}
              onChange={(e) => setIdentifiant(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-gray-800"
              required
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white">
            <Lock className="mr-2 text-gray-400" />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-gray-800"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
