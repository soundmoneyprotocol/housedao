import React, { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function ConfirmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}
