export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-800 p-4">
      <div className="text-center">
        <div className="text-8xl mb-8">🤔</div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">What were you expecting to find?</p>
        <a 
          href="/" 
          className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          Let's Go Back Home
        </a>
      </div>
    </div>
  )
} 