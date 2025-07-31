'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ identifier, password }),
      });

      if (!res.ok) throw new Error('Erreur de connexion');

      const data = await res.json();
      console.log('Connecté:', data);

      router.push('/chat');
    } catch (err) {
      console.error('Erreur login:', err);
    }
  };

  return (
    <div>
      <input value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="Identifiant" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" />
      <button onClick={handleLogin}>Se connecter</button>
    </div>
  );
}
