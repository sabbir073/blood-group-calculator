/* app/layout.tsx (RootLayout)
 * Wraps the entire app with <LanguageProvider> so every page/component can
 * access i18n via useTranslation() / useLanguage().
 */
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { LanguageProvider } from '@/lib/i18n';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Advanced Blood Group Calculator',
  description: 'Multilingual blood‑group inheritance tool',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* i18n context */}
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
