export function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    // Em produção (Next.js em Vercel)
    return process.env.NEXT_PUBLIC_API_URL
  }
  // Ambiente de desenvolvimento
  return 'http://localhost:3000'
}
