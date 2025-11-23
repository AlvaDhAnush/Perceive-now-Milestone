import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

export interface SystemMetrics {
  cpu: number
  memory: number
  latency: number
  jobsProcessed: number
  activeWorkflows: number
  timestamp: Date
}

async function fetchMetrics(): Promise<SystemMetrics> {
  // Simulate API call with latency
  await new Promise((resolve) => setTimeout(resolve, 300))
  
  return {
    cpu: Math.random() * 30 + 40,
    memory: Math.random() * 20 + 60,
    latency: Math.random() * 50 + 20,
    jobsProcessed: Math.floor(Math.random() * 1000) + 5000,
    activeWorkflows: Math.floor(Math.random() * 10) + 5,
    timestamp: new Date(),
  }
}

export function useMetrics() {
  const { data, isLoading, error } = useQuery<SystemMetrics>({
    queryKey: ['metrics'],
    queryFn: fetchMetrics,
    refetchInterval: 3000, // Auto-refresh every 3 seconds
    staleTime: 2000,
  })

  return { metrics: data, isLoading, error }
}

