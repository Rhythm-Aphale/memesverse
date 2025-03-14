"use client";
import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Use effect to check if the component has mounted
  useEffect(() => {
    setMounted(true);
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!mounted) {
    // Avoid layout shift by rendering placeholder with same height
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="h-16"></div> {/* Navbar height placeholder */}
          <main className="pt-16">{children}</main>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={isDarkMode ? 'dark' : ''}>
      <body className={`${inter.className} transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme={isDarkMode ? 'dark' : 'light'}>
          <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          <main className="pt-16">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}