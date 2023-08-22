import './globals.css'
import type { Metadata } from 'next'
import { Rubik, Kanit } from 'next/font/google'

const kanit = Kanit({ 
  subsets: ['latin'], 
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-kanit"
})

const rubik = Rubik({ 
  subsets: ['latin'],
  display: "swap",
  variable: "--font-rubik"
})

export const metadata: Metadata = {
  title: 'Roblox Statistics'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${kanit.variable} ${rubik.variable}`}>
      {children}
    </html>
  )
}
