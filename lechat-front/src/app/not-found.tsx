export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-center px-6">
      <div>
        <h1 className="text-5xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">
          Oups… la page que vous cherchez n'existe pas.
        </p>
        <a
          href="/login"
          className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Revenir à la connexion
        </a>
      </div>
    </div>
  );
}
