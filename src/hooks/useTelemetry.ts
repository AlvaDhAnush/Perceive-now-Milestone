import { useEffect } from 'react'

// Simulated OpenTelemetry instrumentation
export function useTelemetry(action: string, metadata?: Record<string, any>) {
  useEffect(() => {
    const timestamp = Date.now()
    const telemetryEvent = {
      action,
      timestamp,
      metadata: metadata || {},
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    // Log to console (in production, this would send to OpenTelemetry collector)
    console.log('[OpenTelemetry]', telemetryEvent)

    // Simulate sending to backend
    if (window.performance && window.performance.mark) {
      window.performance.mark(`telemetry-${action}-${timestamp}`)
    }
  }, [action, metadata])
}

export function logUserAction(action: string, details?: Record<string, any>) {
  const event = {
    type: 'user_action',
    action,
    timestamp: new Date().toISOString(),
    details,
  }
  console.log('[User Action]', event)
}

export function logPerformanceMetric(metric: string, value: number, unit: string = 'ms') {
  const event = {
    type: 'performance',
    metric,
    value,
    unit,
    timestamp: new Date().toISOString(),
  }
  console.log('[Performance]', event)
}

