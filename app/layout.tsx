import type { Metadata } from 'next'
import './globals.css'

const emojiFavicon =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤔</text></svg>";

export const metadata: Metadata = {
  title: 'Question of the Day',
  description: 'Create a question of the day for your team.',
  icons: {
    icon: emojiFavicon,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
