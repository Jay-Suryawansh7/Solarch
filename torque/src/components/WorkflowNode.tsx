'use client'
import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { motion } from 'framer-motion'
import { getCategoryColor } from '@/lib/store'
import { NodeHandle } from '@/types/workflow'
import { Zap, Brain, Database, Play, GitBranch, Globe, Clock, Mail, MessageSquare, FileText, Code, ArrowLeftRight, Repeat, ToggleLeft, Webhook, Download, Save, Logs, Route, Cpu } from 'lucide-react'

const HANDLE_COLORS: Record<string, string> = {
  response: '#6c5ce7',
  stream: '#f59f00',
  prompt: '#6c5ce7',
  memory: '#339af0',
  tools: '#40c057',
  input: '#339af0',
  output: '#6c5ce7',
  error: '#e03131',
  success: '#40c057',
  failed: '#e03131',
  true: '#40c057',
  false: '#e03131',
  image: '#6c5ce7',
  analysis: '#6c5ce7',
  config: '#339af0',
  item: '#40c057',
  done: '#9898b0',
  result: '#40c057',
  exhausted: '#e03131',
  unique: '#40c057',
  duplicate: '#9898b0',
  sent: '#40c057',
  payload: '#40c057',
  event: '#f59f00',
  new: '#40c057',
  try: '#f59f00',
  catch: '#e03131',
  array: '#e03131',
}

function getHandleColor(handle: NodeHandle): string {
  return handle.color || HANDLE_COLORS[handle.id] || '#9898b0'
}

const nodeIcons: Record<string, React.ReactNode> = {
  webhook: <Webhook className="size-3.5" />,
  schedule: <Clock className="size-3.5" />,
  form_submit: <FileText className="size-3.5" />,
  email_in: <Mail className="size-3.5" />,
  db_watch: <Database className="size-3.5" />,
  custom_event: <Zap className="size-3.5" />,
  llm: <Brain className="size-3.5" />,
  llm_vision: <Cpu className="size-3.5" />,
  llm_tool_use: <Cpu className="size-3.5" />,
  embed: <Code className="size-3.5" />,
  classify: <GitBranch className="size-3.5" />,
  extract: <FileText className="size-3.5" />,
  translate: <Globe className="size-3.5" />,
  summarize: <FileText className="size-3.5" />,
  rag_search: <Database className="size-3.5" />,
  image_gen: <Cpu className="size-3.5" />,
  audio_transcribe: <FileText className="size-3.5" />,
  http_request: <Globe className="size-3.5" />,
  graphql: <Globe className="size-3.5" />,
  send_email: <Mail className="size-3.5" />,
  push_notification: <Bell className="size-3.5" />,
  slack_message: <MessageSquare className="size-3.5" />,
  discord_message: <MessageSquare className="size-3.5" />,
  sms_twilio: <MessageSquare className="size-3.5" />,
  github_action: <Code className="size-3.5" />,
  notion_create: <FileText className="size-3.5" />,
  file_upload: <Download className="size-3.5" />,
  webhook_send: <Webhook className="size-3.5" />,
  pdf_generate: <FileText className="size-3.5" />,
  condition: <ToggleLeft className="size-3.5" />,
  switch: <Route className="size-3.5" />,
  loop: <Repeat className="size-3.5" />,
  delay: <Clock className="size-3.5" />,
  code: <Code className="size-3.5" />,
  retry: <Repeat className="size-3.5" />,
  try_catch: <GitBranch className="size-3.5" />,
  parallel: <GitBranch className="size-3.5" />,
  throttle: <Clock className="size-3.5" />,
  dedup_events: <GitBranch className="size-3.5" />,
  log: <Logs className="size-3.5" />,
  webhook_response: <Webhook className="size-3.5" />,
  export_csv: <Download className="size-3.5" />,
  save_record: <Save className="size-3.5" />,
  return_data: <Save className="size-3.5" />,
  webhook_slack: <MessageSquare className="size-3.5" />,
}

function Bell(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> }

const positionMap: Record<string, Position> = {
  top: Position.Top,
  right: Position.Right,
  bottom: Position.Bottom,
  left: Position.Left,
}

function WorkflowNode({ data, selected }: NodeProps) {
  const color = getCategoryColor(data.category)
  const icon = nodeIcons[data.nodeType] || <Zap className="size-3.5" />
  const handles: NodeHandle[] = data.handles || []

  const targetHandles = handles.filter(h => h.type === 'target')
  const sourceHandles = handles.filter(h => h.type === 'source')
  const hasCustomHandles = handles.length > 0

  const compactMode = handles.length > 4

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className={`torque-node rounded-xl border bg-card px-3 py-2.5 min-w-[180px] transition-all duration-150 relative ${selected ? 'border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10' : 'border-border hover:border-border/80'}`}>
        {/* Default handles (fallback when no custom handles) */}
        {!hasCustomHandles && (
          <>
            <Handle type="target" position={Position.Top} className="!bg-primary !border-2 !border-background" />
            <Handle type="source" position={Position.Bottom} className="!bg-primary !border-2 !border-background" />
          </>
        )}

        {/* Custom target handles */}
        {hasCustomHandles && targetHandles.map((handle) => {
          const hc = getHandleColor(handle)
          const isLeft = handle.position === 'left'
          const isTop = handle.position === 'top'
          const isBottom = handle.position === 'bottom'
          return (
            <div key={handle.id}>
              <Handle
                type="target"
                position={positionMap[handle.position]}
                id={handle.id}
                className="!border-2 !border-background !z-10"
                style={{
                  background: hc,
                  width: compactMode ? 8 : 10,
                  height: compactMode ? 8 : 10,
                  ...(isLeft ? { left: 0 } : {}),
                  ...(isTop ? { top: 0 } : {}),
                  ...(isBottom ? { bottom: 0 } : {}),
                }}
              />
              <div
                className="absolute pointer-events-none text-[8px] font-medium whitespace-nowrap"
                style={{
                  color: hc,
                  ...(isLeft ? { left: 14, top: '50%', transform: 'translateY(-50%)' } : {}),
                  ...(isTop ? { top: -16, left: '50%', transform: 'translateX(-50%)' } : {}),
                  ...(isBottom ? { bottom: -16, left: '50%', transform: 'translateX(-50%)' } : {}),
                }}
              >
                {handle.label}
              </div>
            </div>
          )
        })}

        {/* Body */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-muted-foreground" style={{ color }}>
            {icon}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>
            {data.category}
          </span>
          {hasCustomHandles && (
            <span className="ml-auto text-[8px] text-muted-foreground/40">
              {handles.filter(h => h.type === 'target').length}in {handles.filter(h => h.type === 'source').length}out
            </span>
          )}
        </div>

        <div className="text-sm font-medium text-foreground">{data.label}</div>

        {data.nodeType === 'llm' && data.config?.model && (
          <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">{data.config.model}</div>
        )}
        {data.nodeType === 'http_request' && data.config?.url && (
          <div className="text-[10px] text-muted-foreground mt-0.5 truncate font-mono">
            <span className="text-[9px] font-semibold uppercase" style={{ color: data.config.method === 'POST' ? '#40c057' : data.config.method === 'DELETE' ? '#e03131' : '#339af0' }}>
              {data.config.method || 'GET'}
            </span>
            {' '}{data.config.url}
          </div>
        )}
        {data.nodeType === 'schedule' && data.config?.cron && (
          <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">{data.config.cron}</div>
        )}
        {data.nodeType === 'condition' && data.config?.expression && (
          <div className="text-[10px] text-muted-foreground mt-0.5 font-mono truncate">{data.config.expression}</div>
        )}
        {data.nodeType === 'llm' && data.config?.temperature && (
          <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">temp: {data.config.temperature}</div>
        )}

        {/* Custom source handles */}
        {hasCustomHandles && sourceHandles.map((handle) => {
          const hc = getHandleColor(handle)
          const isRight = handle.position === 'right'
          const isBottom = handle.position === 'bottom'
          return (
            <div key={handle.id}>
              <Handle
                type="source"
                position={positionMap[handle.position]}
                id={handle.id}
                className="!border-2 !border-background !z-10"
                style={{
                  background: hc,
                  width: compactMode ? 8 : 10,
                  height: compactMode ? 8 : 10,
                  ...(isRight ? { right: 0 } : {}),
                  ...(isBottom ? { bottom: 0 } : {}),
                }}
              />
              <div
                className="absolute pointer-events-none text-[8px] font-medium whitespace-nowrap"
                style={{
                  color: hc,
                  ...(isRight ? { right: 14, top: '50%', transform: 'translateY(-50%)' } : {}),
                  ...(isBottom && !isRight ? { bottom: -16, left: '50%', transform: 'translateX(-50%)' } : {}),
                  ...(isBottom && isRight ? { bottom: -16, left: '50%', transform: 'translateX(-50%)' } : {}),
                }}
              >
                {handle.label}
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default memo(WorkflowNode)
