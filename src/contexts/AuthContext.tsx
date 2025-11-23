import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'admin' | 'analyst' | 'viewer'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const rolePermissions: Record<UserRole, string[]> = {
  admin: ['view', 'edit', 'delete', 'manage', 'configure'],
  analyst: ['view', 'edit'],
  viewer: ['view'],
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const login = async (email: string, _password: string): Promise<boolean> => {
    // Mock login - in real app, this would call an API
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    // Simulate different users based on email
    let role: UserRole = 'viewer'
    if (email.includes('admin')) role = 'admin'
    else if (email.includes('analyst')) role = 'analyst'
    
    const newUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      role,
    }
    
    setUser(newUser)
    return true
  }

  const logout = () => {
    setUser(null)
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return rolePermissions[user.role].includes(permission)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

