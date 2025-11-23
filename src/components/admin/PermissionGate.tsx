import { ReactNode } from 'react'
import { useAuth } from '../../contexts/AuthContext'

interface PermissionGateProps {
  permission: string
  children: ReactNode
  fallback?: ReactNode
}

export default function PermissionGate({
  permission,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { hasPermission } = useAuth()

  if (!hasPermission(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

