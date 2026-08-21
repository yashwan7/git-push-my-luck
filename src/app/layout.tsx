import type { Metadata } from 'next';
import './globals.css';
import { AccessibilityProvider } from '@/context/AccessibilityContext';
import { VoiceProvider } from '@/context/VoiceContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { VoiceController } from '@/components/accessibility/VoiceController';

export const metadata: Metadata = {
  title: 'NAYAN — Adaptive Digital Accessibility & Inclusion Platform',
  description: 'Technology should adapt to people. People should not have to adapt to technology. One service. Every ability. Every language. Every interaction style.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-text-size="normal" data-contrast="standard">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Instrument+Serif:ital@1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
        <AuthProvider>
          <AccessibilityProvider>
            <VoiceProvider>
              <Navbar />
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                {children}
              </main>
              <VoiceController />
            </VoiceProvider>
          </AccessibilityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
