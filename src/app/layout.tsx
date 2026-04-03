import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import '../globals.css';

export const metadata: Metadata = {
  title: 'HouseDAO - Fractional Real Estate',
  description: 'Invest in real estate with fractional ownership and DAO governance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
