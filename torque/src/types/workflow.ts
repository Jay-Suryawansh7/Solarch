export interface WorkflowNode {
  id: string
  type: string
  label?: string
  config: Record<string, any>
  position?: { x: number; y: number }
}

export interface WorkflowEdge {
  id: string
  from: string
  to: string
  label?: string
  condition?: string
}

export interface WorkflowDefinition {
  workflowId: string
  name: string
  description?: string
  version?: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  config?: {
    maxRetries?: number
    timeout?: number
    enableLogging?: boolean
    tags?: string[]
  }
}

export interface ConfigField {
  type: 'string' | 'text' | 'number' | 'select' | 'code' | 'boolean' | 'multi-select' | 'slider'
  label?: string
  description?: string
  placeholder?: string
  default?: any
  options?: string[]
  min?: number
  max?: number
  step?: number
}

export interface NodeHandle {
  id: string
  type: 'source' | 'target'
  position: 'top' | 'right' | 'bottom' | 'left'
  label: string
  color?: string
}

export interface NodeDefinition {
  type: string
  label: string
  description: string
  category: 'trigger' | 'ai' | 'data' | 'action' | 'logic' | 'output'
  configSchema?: Record<string, ConfigField>
  inputs?: number
  outputs?: number
  handles?: NodeHandle[]
}
