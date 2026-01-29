import { Suspense } from 'react'
import OtpVerifyForm from '@/components/auth/OtpVerifyForm'

export const dynamic = 'force-dynamic'

export default function OtpVerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpVerifyForm />
    </Suspense>
  )
}
