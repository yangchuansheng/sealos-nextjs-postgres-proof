import './styles.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Sealos Next.js PostgreSQL Proof',
  description: 'Minimal proof app for validating Next.js and PostgreSQL on Sealos.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
