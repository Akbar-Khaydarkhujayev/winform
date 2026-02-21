export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
        <p className="text-text-secondary text-lg mb-6">Sahifa topilmadi</p>
        <a
          href="/"
          className="inline-block bg-accent hover:bg-accent-hover text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
        >
          Bosh sahifaga qaytish
        </a>
      </div>
    </div>
  );
}
