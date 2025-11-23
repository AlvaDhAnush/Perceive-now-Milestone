import { useEffect, useRef } from 'react'
import { useWorkflowStore, NodeStatus } from '../store/workflowStore'

export function useWebSocket() {
  const { updateNodeStatus, setConnected } = useWorkflowStore()
  const intervalRef = useRef<number | null>(null)
  const nodeSequenceRef = useRef(0)

  useEffect(() => {
    // Simulate WebSocket connection
    setConnected(true)

    // Simulate real-time events
    const simulateEvent = () => {
      const nodes = useWorkflowStore.getState().nodes
      const nodeIndex = nodeSequenceRef.current % nodes.length
      const node = nodes[nodeIndex]

      if (!node) return

      // Simulate workflow progression
      const statusSequence: NodeStatus[] = ['idle', 'running', 'completed']
      const currentIndex = statusSequence.indexOf(node.data.status)
      
      if (currentIndex < statusSequence.length - 1) {
        const nextStatus = statusSequence[currentIndex + 1]
        const logMessages: Record<NodeStatus, string> = {
          idle: 'Node initialized',
          running: `Processing ${node.data.label.toLowerCase()}...`,
          completed: `${node.data.label} completed successfully`,
          failed: `Error in ${node.data.label}`,
        }
        
        updateNodeStatus(node.id, nextStatus, logMessages[nextStatus])
      } else if (node.data.status === 'completed') {
        // Occasionally simulate failures
        if (Math.random() < 0.1) {
          updateNodeStatus(node.id, 'failed', `Error: Failed to process ${node.data.label}`)
        } else {
          // Reset to idle for next cycle
          updateNodeStatus(node.id, 'idle', 'Ready for next execution')
        }
      } else if (node.data.status === 'failed') {
        // Reset failed nodes after a delay
        updateNodeStatus(node.id, 'idle', 'Reset after failure')
      }

      nodeSequenceRef.current++
    }

    // Simulate events every 2-4 seconds
    intervalRef.current = window.setInterval(() => {
      const delay = Math.random() * 2000 + 2000
      setTimeout(simulateEvent, delay)
    }, 3000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      setConnected(false)
    }
  }, [updateNodeStatus, setConnected])
}

