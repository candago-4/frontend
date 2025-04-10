'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthHandler({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const router = useRouter()
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem('role')

    if (!role || (allowedRoles && !allowedRoles.includes(role))) {
      router.push('/login')
    } else {
      setIsVerified(true)
    }
  }, [])

  if (!isVerified) return null
  return <>{children}</>
}