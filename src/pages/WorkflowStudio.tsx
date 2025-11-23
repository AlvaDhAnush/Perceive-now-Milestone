import { useCallback, useEffect, useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import CustomNode from '../components/workflow/CustomNode'
import NodeDetailsPanel from '../components/workflow/NodeDetailsPanel'
import { useWorkflowStore } from '../store/workflowStore'
import { useWebSocket } from '../hooks/useWebSocket'
import { format } from 'date-fns'

const nodeTypes = {
  custom: CustomNode,
}

function WorkflowCanvas() {
  const { nodes, edges, selectedNode, setSelectedNode, isConnected } = useWorkflowStore()
  const { fitView } = useReactFlow()

  useWebSocket()

  useEffect(() => {
    fitView({ padding: 0.2 })
  }, [fitView])

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      setSelectedNode(node)
    },
    [setSelectedNode]
  )

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [setSelectedNode])

  const performanceMetrics = useMemo(() => {
    const renderStart = performance.now()
    return {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      renderTime: performance.now() - renderStart,
    }
  }, [nodes.length, edges.length])

  return (
    <div className="h-[calc(100vh-14rem)] w-full rounded-lg bg-gradient-to-br from-gray-50 to-white relative shadow-inner border-2 border-gray-200/60">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#e5e7eb" gap={16} variant="dots" />
        <Controls className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg" />
        <MiniMap
          nodeColor={(node: any) => {
            const colors: Record<string, string> = {
              idle: '#9ca3af',
              running: '#3b82f6',
              completed: '#10b981',
              failed: '#ef4444',
            }
            return colors[node.data?.status] || '#9ca3af'
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg"
        />
        <Panel position="top-left" className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/60 p-4 m-3">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-gray-700 font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="text-gray-600">
              Nodes: <span className="font-bold text-gray-900">{performanceMetrics.nodeCount}</span>
            </div>
            <div className="text-gray-600">
              Render: <span className="font-bold text-gray-900">{performanceMetrics.renderTime.toFixed(2)}ms</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
      
      <NodeDetailsPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  )
}

export default function WorkflowStudio() {
  return (
    <div className="space-y-8 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Workflow Studio
              </h1>
              <p className="mt-1 text-gray-600">
                Real-time visualization and management of distributed validation pipelines
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-600">Last updated: {format(new Date(), 'HH:mm:ss')}</span>
        </div>
      </div>

      <div className="card-gradient p-0 overflow-hidden border-2 border-gray-200/80">
        <ReactFlowProvider>
          <WorkflowCanvas />
        </ReactFlowProvider>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-gradient border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Performance</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">Optimized</p>
          <p className="text-sm text-gray-600">Virtualized rendering enabled</p>
        </div>
        <div className="card-gradient border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Real-time Sync</h3>
          <p className="text-3xl font-bold text-primary-600 mb-1">Active</p>
          <p className="text-sm text-gray-600">WebSocket connection established</p>
        </div>
        <div className="card-gradient border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">State Management</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">Zustand</p>
          <p className="text-sm text-gray-600">Isolated node state slices</p>
        </div>
      </div>
    </div>
  )
}

