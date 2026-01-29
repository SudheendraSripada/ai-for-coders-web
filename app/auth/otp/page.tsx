import { Suspense } from 'react'
import OtpForm from '@/components/auth/OtpForm'

export const dynamic = 'force-dynamic'

export default function OtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpForm />
    </Suspense>
  )
}
