import { format } from 'date-fns'
import { WorkflowNode, NodeStatus } from '../../store/workflowStore'

interface NodeDetailsPanelProps {
  node: WorkflowNode | null
  onClose: () => void
}

const statusLabels: Record<NodeStatus, string> = {
  idle: 'Idle',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
}

export default function NodeDetailsPanel({ node, onClose }: NodeDetailsPanelProps) {
  if (!node) return null

  const { data } = node
  const statusColor = {
    idle: 'bg-gray-100 text-gray-800',
    running: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  }[data.status]

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gradient-to-br from-white to-gray-50 shadow-2xl border-l-2 border-gray-200/80 z-50 animate-slide-up backdrop-blur-sm">
      <div className="p-6 border-b border-gray-200/60 bg-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Node Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-5rem)]">
        <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl border border-primary-200/50">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Node Name</label>
          <p className="text-xl font-bold text-gray-900">{data.label}</p>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Current State</label>
          <div className="mt-2">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm ${statusColor}`}>
              <div className={`w-2 h-2 rounded-full ${data.status === 'running' ? 'animate-pulse' : ''} ${
                data.status === 'completed' ? 'bg-green-600' :
                data.status === 'failed' ? 'bg-red-600' :
                data.status === 'running' ? 'bg-blue-600' :
                'bg-gray-600'
              }`} />
              {statusLabels[data.status]}
            </span>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/60">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Last Updated</label>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-gray-900">
              {format(data.lastUpdated, 'PPpp')}
            </p>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Log Message</label>
          <div className="mt-2 p-4 bg-gray-900 rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-xs text-gray-400 font-mono">terminal</span>
            </div>
            <p className="text-sm text-green-400 font-mono">
              {data.logMessage || 'No log message available'}
            </p>
          </div>
        </div>

        {data.metrics && (
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Performance Metrics</label>
            <div className="space-y-3">
              {data.metrics.duration && (
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl border border-blue-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Duration</span>
                    </div>
                    <span className="text-lg font-bold text-blue-900">
                      {(data.metrics.duration / 1000).toFixed(2)}s
                    </span>
                  </div>
                </div>
              )}
              {data.metrics.memory && (
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/30 rounded-xl border border-purple-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Memory</span>
                    </div>
                    <span className="text-lg font-bold text-purple-900">
                      {data.metrics.memory.toFixed(0)} MB
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/60">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Node ID</label>
          <p className="text-sm text-gray-700 font-mono bg-white px-3 py-2 rounded-lg border border-gray-200">{node.id}</p>
        </div>
      </div>
    </div>
  )
}

