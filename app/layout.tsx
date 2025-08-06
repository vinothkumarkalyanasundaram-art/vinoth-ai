import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React, { Suspense } from "react";

const inter = Inter({ subsets: ['latin'] })
import Navbar from '@/app/components/Navbar'
import Provider from './components/Providers'
import Footer from '@/app/components/Footer'

export const metadata: Metadata = {
  title: 'Vinoth Kumar Profile',
  description: 'A complete developer using Next.js, PHP, Prisma ORM, MySQL, TailwindCSS, Material UI, Shadcn, Server-side Rendering, Static Site Generation, Incremental Static Regenartion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-black dark:bg-[#083344] dark:text-white h-full 
        `}>
        <Provider>
          <Navbar />
          <main className='max-w-6xl px-4 mx-auto sm:px-6 lg:px-8'>
            {children}
          </main>
          {/* <Suspense fallback={<div>Loading footer...</div>}> */}
            <Footer />
          {/* </Suspense> */}
        </Provider>
      </body>
    </html>
  )
}
