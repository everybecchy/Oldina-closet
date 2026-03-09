import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { StoreProvider } from '@/lib/store-context'
import './globals.css'

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant'
});

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600'],
  variable: '--font-montserrat'
});

export const metadata: Metadata = {
  title: 'Ondina Closet | Joias Exclusivas',
  description: 'Descubra joias elegantes e sofisticadas na Ondina Closet. Anéis, colares, brincos e pulseiras para todas as ocasiões.',
  generator: 'v0.app',
  icons: {
    icon: '/images/logo.jpeg',
    apple: '/images/logo.jpeg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FDF2F4',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="bg-background">
      <body className={`${cormorant.variable} ${montserrat.variable} font-sans antialiased`}>
        <AuthProvider>
          <StoreProvider>
            {children}
          </StoreProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
