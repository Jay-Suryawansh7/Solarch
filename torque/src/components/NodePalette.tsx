'use client'

import { useState } from 'react'
import { useWorkflowStore, getCategoryColor } from '@/lib/store'
import { NodeDefinition } from '@/types/workflow'
import { Badge } from '@/components/ui/badge'
import { Search, Zap, Brain, Database, Play, GitBranch, LogOut } from 'lucide-react'

const categoryMeta: Record<string, { label: string; icon: React.ReactNode }> = {
  trigger: { label: 'Triggers', icon: <Zap className="size-3" /> },
  ai: { label: 'AI', icon: <Brain className="size-3" /> },
  data: { label: 'Data', icon: <Database className="size-3" /> },
  action: { label: 'Actions', icon: <Play className="size-3" /> },
  logic: { label: 'Logic', icon: <GitBranch className="size-3" /> },
  output: { label: 'Output', icon: <LogOut className="size-3" /> },
}

const categoryOrder = ['trigger', 'ai', 'data', 'action', 'logic', 'output']

export default function NodePalette() {
  const nodeTypes = useWorkflowStore(s => s.nodeTypes)
  const addNode = useWorkflowStore(s => s.addNode)
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? nodeTypes.filter(n => n.label.toLowerCase().includes(search.toLowerCase()) || n.type.toLowerCase().includes(search.toLowerCase()))
    : nodeTypes

  const onDragStart = (event: React.DragEvent, nodeType: NodeDefinition) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeType))
    event.dataTransfer.effectAllowed = 'move'
  }

  const onClickAdd = (nodeType: NodeDefinition) => {
    const centerX = window.innerWidth / 2 - 100
    const centerY = window.innerHeight / 2 - 50
    const offset = Math.max(0, (useWorkflowStore.getState().nodes.length - 1) * 30)
    addNode(nodeType, { x: centerX + offset, y: centerY + offset })
  }

  return (
    <div className="w-64 shrink-0 border-r border-border bg-card flex flex-col h-full">
      <div className="px-3 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nodes</h2>
          <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0">{nodeTypes.length}</Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <input
            className="w-full h-7 rounded-md border border-input bg-transparent pl-7 pr-2 text-xs text-foreground outline-none focus:border-ring transition-colors placeholder:text-muted-foreground"
            placeholder="Search nodes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-2">
          {categoryOrder.map(catKey => {
            const items = filtered.filter(n => n.category === catKey)
            if (items.length === 0) return null
            const meta = categoryMeta[catKey]
            return (
              <div key={catKey} className="mb-2">
                <div className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {meta.icon}
                  <span>{meta.label}</span>
                  <span className="ml-auto text-[9px] text-muted-foreground/60">{items.length}</span>
                </div>
                <div>
                  {items.map(node => (
                    <div
                      key={node.type}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-muted/60 transition-colors text-sm text-muted-foreground hover:text-foreground group w-full text-left"
                      draggable
                      onDragStart={(e) => onDragStart(e, node)}
                      onClick={() => onClickAdd(node)}
                      title={`${node.description}${node.configSchema && Object.keys(node.configSchema).length > 0 ? ` · ${Object.keys(node.configSchema).length} config options` : ''}`}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0 ring-1 ring-black/20"
                        style={{ background: getCategoryColor(node.category) }}
                      />
                      <span className="flex-1 truncate">{node.label}</span>
                      <span className="text-[9px] text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                        {node.inputs || 0}→{node.outputs || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Search className="size-6 mb-2 opacity-40" />
              <p className="text-xs">No nodes match</p>
              <p className="text-[10px] opacity-60">Try a different search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
