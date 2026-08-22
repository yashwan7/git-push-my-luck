import type { Metadata } from 'next';
import './globals.css';
import { AccessibilityProvider } from '@/context/AccessibilityContext';
import { VoiceProvider } from '@/context/VoiceContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { VoiceController } from '@/components/accessibility/VoiceController';

export const metadata: Metadata = {
  title: 'ANUKOOL — Adaptive Digital Accessibility & Inclusion Platform',
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('nayan_theme_mode') || 'light';
                  var isDark = false;
                  if (mode === 'dark') {
                    isDark = true;
                  } else if (mode === 'light') {
                    isDark = false;
                  } else {
                    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  }
                  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[#F3F4F6] dark:bg-[#0D0E12] text-[var(--text-primary)] transition-colors">
        <AuthProvider>
          <AccessibilityProvider>
            <VoiceProvider>
              <Navbar />
              <main className="flex-1 w-full p-2 sm:p-4 md:p-6 max-w-[1520px] mx-auto">
                {children}
              </main>
              <VoiceController />
              <MobileBottomNav />
            </VoiceProvider>
          </AccessibilityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
