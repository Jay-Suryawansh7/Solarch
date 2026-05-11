'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWorkflowStore, getCategoryColor } from '@/lib/store'
import { ConfigField } from '@/types/workflow'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Settings, Trash2, X, Brain, Info, Hash, SlidersHorizontal, ToggleLeft, Check, Code, ChevronDown, RotateCcw, Zap, Database, Play, GitBranch, LogOut } from 'lucide-react'

const categoryIcons: Record<string, React.ReactNode> = {
  trigger: <Zap className="size-3.5" />,
  ai: <Brain className="size-3.5" />,
  data: <Database className="size-3.5" />,
  action: <Play className="size-3.5" />,
  logic: <GitBranch className="size-3.5" />,
  output: <LogOut className="size-3.5" />,
}

function ConfigFieldInput({
  fieldKey,
  field,
  value,
  onChange,
}: {
  fieldKey: string
  field: ConfigField
  value: any
  onChange: (val: any) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const displayLabel = field.label || fieldKey.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).trim()
  const val = value ?? field.default ?? ''
  const isDefault = value === undefined || value === field.default

  return (
    <div className="group relative rounded-md border border-transparent hover:border-border/50 hover:bg-muted/10 transition-all px-2.5 py-2">
      <div className="flex items-start justify-between gap-1 mb-1">
        <label className="text-[11px] font-medium text-foreground truncate flex-1 min-w-0">
          {displayLabel}
        </label>
        <div className="flex items-center gap-1 shrink-0 ml-1">
          {field.type === 'number' && field.min !== undefined && field.max !== undefined && (
            <span className="text-[9px] text-muted-foreground/50 font-mono tabular-nums">{field.min}–{field.max}</span>
          )}
          {!isDefault && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted text-muted-foreground/50 hover:text-foreground"
              title="Reset to default"
            >
              <RotateCcw className="size-2.5" />
            </button>
          )}
        </div>
      </div>
      {field.description && (
        <p className="text-[10px] text-muted-foreground/60 leading-relaxed mb-1.5 break-words">{field.description}</p>
      )}

      {field.type === 'string' && (
        <Input
          value={val}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="h-7 text-xs w-full min-w-0"
        />
      )}

      {field.type === 'text' && (
        <textarea
          rows={3}
          className="w-full rounded-md border border-input bg-transparent px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all resize-none placeholder:text-muted-foreground/50 break-words whitespace-pre-wrap"
          value={val}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
        />
      )}

      {field.type === 'number' && (
        <Input
          type="number"
          value={val}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          min={field.min}
          max={field.max}
          step={field.step}
          placeholder={field.placeholder}
          className="h-7 text-xs w-full min-w-0"
        />
      )}

      {field.type === 'slider' && (
        <div className="pt-0.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 h-1.5 min-w-0">
              <div className="absolute inset-0 rounded-full bg-muted" />
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary/60"
                style={{ width: `${((val - (field.min ?? 0)) / ((field.max ?? 100) - (field.min ?? 0))) * 100}%` }}
              />
              <input
                type="range"
                value={val}
                onChange={e => onChange(parseFloat(e.target.value))}
                min={field.min ?? 0}
                max={field.max ?? 100}
                step={field.step ?? 1}
                className="absolute inset-0 w-full h-full appearance-none cursor-pointer bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background"
              />
            </div>
            <span className="text-[11px] font-mono text-foreground min-w-[2.5ch] text-right tabular-nums font-medium shrink-0">{val}</span>
          </div>
        </div>
      )}

      {field.type === 'select' && (
        <Select value={val} onValueChange={onChange}>
          <SelectTrigger className="w-full h-7 text-xs [&>span]:truncate [&>span]:overflow-hidden [&>span]:max-w-[calc(100%-20px)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-w-[18rem]">
            {(field.options || []).map((opt: string) => (
              <SelectItem key={opt} value={opt} className="text-xs truncate">{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {field.type === 'multi-select' && (
        <div className="flex flex-wrap gap-1">
          {(field.options || []).map((opt: string) => {
            const selected = String(val || '').split(',').map((s: string) => s.trim()).includes(opt)
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const current = String(val || '').split(',').map((s: string) => s.trim()).filter(Boolean)
                  const next = selected ? current.filter((s: string) => s !== opt) : [...current, opt]
                  onChange(next.join(','))
                }}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border transition-all shrink-0 max-w-full ${
                  selected
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-transparent border-border text-muted-foreground hover:border-muted-foreground/40'
                }`}
              >
                {selected && <Check className="size-2.5 shrink-0" />}
                <span className="truncate">{opt}</span>
              </button>
            )
          })}
        </div>
      )}

      {field.type === 'boolean' && (
        <button
          type="button"
          onClick={() => onChange(!val)}
          className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md border text-xs transition-all w-full ${
            val
              ? 'bg-primary/10 border-primary/25 text-primary'
              : 'bg-transparent border-input text-muted-foreground hover:border-muted-foreground/30'
          }`}
        >
          <div className={`relative w-7 h-3.5 rounded-full transition-colors shrink-0 ${val ? 'bg-primary' : 'bg-muted-foreground/25'}`}>
            <div className={`absolute top-0.25 left-0.5 w-2.5 h-2.5 rounded-full bg-white shadow-sm transition-transform ${val ? 'translate-x-3.5' : 'translate-x-0'}`} />
          </div>
          <span>{val ? 'Enabled' : 'Disabled'}</span>
        </button>
      )}

      {field.type === 'code' && (
        <div className="relative">
          <textarea
            rows={expanded ? 12 : 4}
            className="w-full rounded-md border border-input bg-[#0a0a0f] px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all resize-none font-mono leading-relaxed placeholder:text-muted-foreground/50 overflow-x-auto whitespace-pre break-normal"
            value={val}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder}
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="absolute bottom-1 right-1.5 p-0.5 rounded text-[9px] text-muted-foreground/40 hover:text-muted-foreground bg-[#0a0a0f] transition-colors"
          >
            <ChevronDown className={`size-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}
    </div>
  )
}

export default function ConfigPanel() {
  const nodes = useWorkflowStore(s => s.nodes)
  const selectedNode = useWorkflowStore(s => s.selectedNode)
  const updateNodeConfig = useWorkflowStore(s => s.updateNodeConfig)
  const selectNode = useWorkflowStore(s => s.selectNode)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const node = nodes.find(n => n.id === selectedNode)

  const handleDelete = () => {
    if (selectedNode) {
      selectNode(null)
      useWorkflowStore.setState(s => ({
        nodes: s.nodes.filter(n => n.id !== selectedNode),
        edges: s.edges.filter(e => e.source !== selectedNode && e.target !== selectedNode),
      }))
    }
    setConfirmDelete(false)
  }

  const schema = node?.data?.configSchema || {}
  const config = node?.data?.config || {}
  const entries = Object.entries(schema) as [string, ConfigField][]
  const hasConfig = entries.length > 0

  return (
    <div className="w-80 shrink-0 border-l border-border bg-card overflow-hidden flex flex-col h-full">
      <AnimatePresence mode="wait">
        {!node ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center flex-1 p-8 text-center"
          >
            <div className="size-12 rounded-xl bg-muted/40 flex items-center justify-center mb-4 ring-1 ring-border/50">
              <Settings className="size-6 text-muted-foreground/30" />
            </div>
            <p className="text-sm font-medium text-foreground">No Node Selected</p>
            <p className="text-xs text-muted-foreground/70 mt-1 max-w-[180px] leading-relaxed">
              Click a node on the canvas or drag one from the palette
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={node.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col flex-1 min-w-0"
          >
            {/* ── Header ── */}
            <div className="px-3 py-2.5 border-b border-border shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="size-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${getCategoryColor(node.data.category)}18` }}
                >
                  <span className="flex items-center justify-center" style={{ color: getCategoryColor(node.data.category) }}>
                    {categoryIcons[node.data.category] || null}
                  </span>
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-semibold text-foreground truncate leading-tight">{node.data.label}</h2>
                    <Badge variant="outline" className="text-[9px] px-1 py-0 font-mono shrink-0">{node.data.nodeType}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 truncate">
                    <span className="text-[9px] font-medium uppercase tracking-wider shrink-0" style={{ color: getCategoryColor(node.data.category) }}>
                      {node.data.category}
                    </span>
                    <span className="text-[9px] text-muted-foreground/40 truncate">
                      {node.data.handles
                        ? `${node.data.handles.filter((h: any) => h.type === 'source').length} out · ${node.data.handles.filter((h: any) => h.type === 'target').length} in`
                        : `${node.data.outputs ?? 1} out · ${node.data.inputs ?? 1} in`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => { selectNode(null); setConfirmDelete(false) }}
                    className="text-muted-foreground/50 hover:text-foreground"
                  >
                    <X className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setConfirmDelete(true)}
                    className="text-muted-foreground/30 hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* ── Delete Confirmation ── */}
            <AnimatePresence>
              {confirmDelete && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-destructive/20 bg-destructive/5 overflow-hidden"
                >
                  <div className="px-3 py-2 flex items-center gap-2">
                    <p className="text-[11px] text-destructive/80 flex-1 leading-tight">Delete this node?</p>
                    <div className="flex gap-1.5 shrink-0">
                      <Button variant="ghost" size="xs" onClick={() => setConfirmDelete(false)} className="h-6 text-[10px]">
                        Cancel
                      </Button>
                      <Button variant="destructive" size="xs" onClick={handleDelete} className="h-6 text-[10px]">
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Config Fields ── */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="p-2.5">
                {!hasConfig ? (
                  <div className="flex flex-col items-center py-10 text-center">
                    <div className="size-10 rounded-lg bg-muted/30 flex items-center justify-center mb-3">
                      <Info className="size-5 text-muted-foreground/30" />
                    </div>
                    <p className="text-xs text-muted-foreground/80">No configuration needed</p>
                    <p className="text-[10px] text-muted-foreground/50 mt-0.5">This node runs with sensible defaults</p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {entries.map(([key, field]) => (
                      <ConfigFieldInput
                        key={key}
                        fieldKey={key}
                        field={field}
                        value={config[key]}
                        onChange={v => updateNodeConfig(node.id, { ...config, [key]: v })}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="border-t border-border px-3 py-2 shrink-0">
              <div className="flex items-center justify-between text-[9px] text-muted-foreground/50 min-w-0">
                <span className="font-mono truncate">{node.id}</span>
                <span className="shrink-0 ml-2">{entries.filter(([k]) => config[k] !== undefined && config[k] !== schema[k]?.default).length}/{entries.length} modified</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
