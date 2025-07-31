'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Erreur de connexion');
      const data = await res.json();
      console.log('Connecté:', data);
      router.push('/chat');
    } catch (err) {
      console.error('Erreur login:', err);
      alert("Échec de la connexion");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-64">
        <input type="text" placeholder="Identifiant" className="border p-2" value={identifier} onChange={e => setIdentifier(e.target.value)} />
        <input type="password" placeholder="Mot de passe" className="border p-2" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="bg-black text-white py-2">Se connecter</button>
      </form>
    </main>
  );
}
