import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { WorkflowNode, NodeStatus } from '../../store/workflowStore'
import { format } from 'date-fns'

const statusColors: Record<NodeStatus, string> = {
  idle: 'bg-gray-200 text-gray-700',
  running: 'bg-blue-500 text-white animate-pulse-slow',
  completed: 'bg-green-500 text-white',
  failed: 'bg-red-500 text-white',
}

const statusIcons: Record<NodeStatus, string> = {
  idle: '○',
  running: '◉',
  completed: '✓',
  failed: '✗',
}

function CustomNode({ data, selected }: NodeProps<WorkflowNode['data']>) {
  const { label, status, lastUpdated } = data

  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-md border-2 min-w-[180px] transition-all duration-300 ${
        selected ? 'border-primary-500 shadow-lg scale-105' : 'border-gray-300'
      } ${statusColors[status]}`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-sm">{label}</span>
        <span className="text-lg">{statusIcons[status]}</span>
      </div>
      <div className="text-xs opacity-90 mt-1">
        {format(lastUpdated, 'HH:mm:ss')}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
}

export default memo(CustomNode)

