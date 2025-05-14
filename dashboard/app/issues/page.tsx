'use client';

import { Suspense } from 'react';
import IssuesPageClient from '@/components/issues/IssuesPageClient';

export default function IssuesPage() {
  return (
    <Suspense fallback={<div>Loading issues...</div>}>
      <IssuesPageClient />
    </Suspense>
  );
}

// These export configurations ensure the page is rendered dynamically
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;
