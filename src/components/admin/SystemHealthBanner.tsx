import { useMetrics } from '../../hooks/useMetrics'

export default function SystemHealthBanner() {
  const { metrics } = useMetrics()

  if (!metrics) return null

  const getHealthStatus = () => {
    if (metrics.cpu > 80 || metrics.memory > 90 || metrics.latency > 100) {
      return { status: 'critical', color: 'bg-red-500', text: 'Critical' }
    }
    if (metrics.cpu > 60 || metrics.memory > 75 || metrics.latency > 70) {
      return { status: 'warning', color: 'bg-yellow-500', text: 'Warning' }
    }
    return { status: 'healthy', color: 'bg-green-500', text: 'Healthy' }
  }

  const health = getHealthStatus()

  return (
    <div className={`${health.color} text-white px-6 py-3 flex items-center justify-between shadow-lg rounded-lg`}>
      <div className="flex items-center space-x-3">
        <div className="p-1.5 bg-white/20 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <span className="text-sm font-medium opacity-90">System Health</span>
          <span className="ml-2 font-bold text-lg">{health.text}</span>
        </div>
      </div>
      <div className="flex items-center space-x-6 text-sm font-medium">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>CPU: {metrics.cpu.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
          <span>Memory: {metrics.memory.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Latency: {metrics.latency.toFixed(0)}ms</span>
        </div>
      </div>
    </div>
  )
}

