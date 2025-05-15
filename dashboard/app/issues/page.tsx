import dynamic from 'next/dynamic'

const IssuesPageClient = dynamic(() => import('@/app/issues/issues-client'), {
  ssr: false,
})

export default function IssuesPage() {
  return <IssuesPageClient />
}
