import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import LoginModal from '../components/admin/LoginModal'
import PermissionGate from '../components/admin/PermissionGate'
import SystemHealthBanner from '../components/admin/SystemHealthBanner'
import { useMetrics } from '../hooks/useMetrics'
import { useTelemetry, logUserAction } from '../hooks/useTelemetry'
import { format } from 'date-fns'

export default function AdminConsole() {
  const { user } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const { metrics, isLoading } = useMetrics()

  useTelemetry('admin_console_view', { userId: user?.id })

  useEffect(() => {
    if (!user) {
      setShowLogin(true)
    }
  }, [user])

  const handleAction = (action: string) => {
    logUserAction(action, { userId: user?.id, role: user?.role })
  }

  if (!user) {
    return (
      <>
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
        <div className="text-center py-12">
          <p className="text-gray-600">Please login to access the Admin Console</p>
        </div>
      </>
    )
  }

  return (
    <div className="space-y-8 max-w-full">
      <SystemHealthBanner />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Admin Console
              </h1>
              <p className="mt-1 text-gray-600">
                Manage workflows, agents, policies, and access control
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3 px-4 py-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
          <span className="text-sm text-gray-500">Logged in as</span>
          <span className="px-3 py-1.5 text-sm font-semibold rounded-full bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-300/50">
            {user.role}
          </span>
        </div>
      </div>

      {/* Real-time Metrics Dashboard */}
      <PermissionGate permission="view">
        <div className="card-gradient">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">System Metrics</h2>
            </div>
            {metrics && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Updated: {format(metrics.timestamp, 'HH:mm:ss')}</span>
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-primary-600 border-t-transparent"></div>
              <p className="mt-3 text-gray-600 font-medium">Loading metrics...</p>
            </div>
          ) : metrics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="metric-card bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-300/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-blue-700 uppercase tracking-wide">CPU Usage</div>
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-blue-900 mb-3">{metrics.cpu.toFixed(1)}%</div>
                <div className="w-full bg-blue-200/60 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${metrics.cpu}%` }}
                  />
                </div>
              </div>
              
              <div className="metric-card bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-300/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Memory Usage</div>
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-purple-900 mb-3">{metrics.memory.toFixed(1)}%</div>
                <div className="w-full bg-purple-200/60 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${metrics.memory}%` }}
                  />
                </div>
              </div>
              
              <div className="metric-card bg-gradient-to-br from-green-50 to-green-100/50 border-green-300/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-green-700 uppercase tracking-wide">Avg Latency</div>
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-green-900 mb-2">{metrics.latency.toFixed(0)}ms</div>
                <div className="text-sm font-medium text-green-700">
                  {metrics.latency < 50 ? '✓ Excellent' : metrics.latency < 100 ? '✓ Good' : '⚠ Needs attention'}
                </div>
              </div>
              
              <div className="metric-card bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-300/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-orange-700 uppercase tracking-wide">Jobs Processed</div>
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-orange-900 mb-2">
                  {metrics.jobsProcessed.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-orange-700">
                  {metrics.activeWorkflows} active workflows
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">Failed to load metrics</p>
            </div>
          )}
        </div>
      </PermissionGate>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PermissionGate permission="view">
          <div className="card-gradient border-l-4 border-l-blue-500 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Workflows</h3>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              View and manage workflow configurations
            </p>
            <PermissionGate permission="edit">
              <button
                onClick={() => handleAction('workflow_edit')}
                className="btn-primary w-full"
              >
                Manage Workflows
              </button>
            </PermissionGate>
            <PermissionGate permission="view" fallback={
              <button className="btn-secondary w-full" disabled>
                View Only
              </button>
            }>
              <button
                onClick={() => handleAction('workflow_view')}
                className="btn-secondary w-full"
              >
                View Workflows
              </button>
            </PermissionGate>
          </div>
        </PermissionGate>

        <PermissionGate permission="view">
          <div className="card-gradient border-l-4 border-l-purple-500 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Agents</h3>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Configure and monitor automation agents
            </p>
            <PermissionGate permission="edit">
              <button
                onClick={() => handleAction('agent_edit')}
                className="btn-primary w-full"
              >
                Manage Agents
              </button>
            </PermissionGate>
            <PermissionGate permission="view" fallback={
              <button className="btn-secondary w-full" disabled>
                View Only
              </button>
            }>
              <button
                onClick={() => handleAction('agent_view')}
                className="btn-secondary w-full"
              >
                View Agents
              </button>
            </PermissionGate>
          </div>
        </PermissionGate>

        <PermissionGate permission="view">
          <div className="card-gradient border-l-4 border-l-green-500 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Policies</h3>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Define and enforce system policies
            </p>
            <PermissionGate permission="edit">
              <button
                onClick={() => handleAction('policy_edit')}
                className="btn-primary w-full"
              >
                Manage Policies
              </button>
            </PermissionGate>
            <PermissionGate permission="view" fallback={
              <button className="btn-secondary w-full" disabled>
                View Only
              </button>
            }>
              <button
                onClick={() => handleAction('policy_view')}
                className="btn-secondary w-full"
              >
                View Policies
              </button>
            </PermissionGate>
          </div>
        </PermissionGate>

        <PermissionGate permission="manage" fallback={
          <div className="card-gradient opacity-60 border-l-4 border-l-gray-400">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-400">Access Control</h3>
            </div>
            <p className="text-sm text-gray-400 mb-5">
              Requires admin permissions
            </p>
            <button className="btn-secondary w-full" disabled>
              Access Denied
            </button>
          </div>
        }>
          <div className="card-gradient border-l-4 border-l-primary-500 border-2 border-primary-200/50 group shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Access Control</h3>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Manage user roles and permissions
            </p>
            <button
              onClick={() => handleAction('access_control_manage')}
              className="btn-primary w-full"
            >
              Manage Access
            </button>
          </div>
        </PermissionGate>
      </div>

      {/* Activity Log */}
      <PermissionGate permission="view">
        <div className="card-gradient">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          </div>
          <div className="space-y-3">
            {[
              { action: 'Workflow executed', user: 'system', time: '2 minutes ago', icon: 'workflow' },
              { action: 'Policy updated', user: user.name, time: '15 minutes ago', icon: 'policy' },
              { action: 'Agent restarted', user: 'system', time: '1 hour ago', icon: 'agent' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200/60 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 block">{activity.action}</span>
                    <span className="text-sm text-gray-500">by {activity.user}</span>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </PermissionGate>
    </div>
  )
}

