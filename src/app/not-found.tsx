export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background-secondary)] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">404</h1>
        <p className="text-xl text-[var(--foreground-secondary)] mb-6">Page not found</p>
        <a 
          href="/dashboard" 
          className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
