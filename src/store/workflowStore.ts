import { create } from 'zustand'
import { Node, Edge } from 'reactflow'

export type NodeStatus = 'idle' | 'running' | 'completed' | 'failed'

export interface WorkflowNode extends Node {
  data: {
    label: string
    status: NodeStatus
    lastUpdated: Date
    logMessage?: string
    metrics?: {
      duration?: number
      memory?: number
    }
  }
}

interface WorkflowState {
  nodes: WorkflowNode[]
  edges: Edge[]
  selectedNode: WorkflowNode | null
  isConnected: boolean
  updateNodeStatus: (nodeId: string, status: NodeStatus, logMessage?: string) => void
  setSelectedNode: (node: WorkflowNode | null) => void
  setNodes: (nodes: WorkflowNode[]) => void
  setEdges: (edges: Edge[]) => void
  setConnected: (connected: boolean) => void
}

const initialNodes: WorkflowNode[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 100 },
    data: {
      label: 'Data Ingestion',
      status: 'idle',
      lastUpdated: new Date(),
      logMessage: 'Waiting for trigger',
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 250, y: 250 },
    data: {
      label: 'Validation',
      status: 'idle',
      lastUpdated: new Date(),
      logMessage: 'Pending',
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 100, y: 400 },
    data: {
      label: 'Transform',
      status: 'idle',
      lastUpdated: new Date(),
      logMessage: 'Pending',
    },
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 400, y: 400 },
    data: {
      label: 'Enrichment',
      status: 'idle',
      lastUpdated: new Date(),
      logMessage: 'Pending',
    },
  },
  {
    id: '5',
    type: 'custom',
    position: { x: 250, y: 550 },
    data: {
      label: 'Output',
      status: 'idle',
      lastUpdated: new Date(),
      logMessage: 'Pending',
    },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e4-5', source: '4', target: '5' },
]

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNode: null,
  isConnected: false,
  updateNodeStatus: (nodeId, status, logMessage) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                status,
                lastUpdated: new Date(),
                logMessage: logMessage || node.data.logMessage,
                metrics: status === 'completed' 
                  ? { duration: Math.random() * 5000 + 1000, memory: Math.random() * 100 + 50 }
                  : node.data.metrics,
              },
            }
          : node
      ),
    })),
  setSelectedNode: (node) => set({ selectedNode: node }),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setConnected: (connected) => set({ isConnected: connected }),
}))

