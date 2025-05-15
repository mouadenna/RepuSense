"use client"

import dynamic from 'next/dynamic'

const IssuesPageClient = dynamic(() => import('@/app/issues/issues-client'))

export default function IssuesPage() {
  return <IssuesPageClient />
}