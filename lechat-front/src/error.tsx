'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Une erreur est survenue :', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-center px-6">
      <div>
        <h1 className="text-5xl font-bold text-red-600 mb-4">500</h1>
        <p className="text-xl text-gray-700 mb-6">
          Une erreur inattendue s'est produite. Veuillez réessayer.
        </p>
        <button
          onClick={() => reset()}
          className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
