'use client'
import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { motion } from 'framer-motion'
import { getCategoryColor } from '@/lib/store'
import { NodeHandle } from '@/types/workflow'
import { Zap, Brain, Database, Play, GitBranch, Globe, Clock, Mail, MessageSquare, FileText, Code, ArrowLeftRight, Repeat, ToggleLeft, Webhook, Download, Save, Logs, Route, Cpu, Bot, Sparkles, Server, HardDrive, Cloud, MessageCircle, Table, Workflow } from 'lucide-react'

const NODE_WIDTHS: Record<string, number> = {
  webhook: 200, schedule: 200, form_submit: 200, email_in: 200, db_watch: 200, custom_event: 200, chat_trigger: 220,
  llm: 260, llm_vision: 240, llm_tool_use: 280, embed: 200, classify: 200, extract: 200, translate: 200,
  summarize: 200, rag_search: 220, image_gen: 220, audio_transcribe: 200,
  llm_local: 240, llm_azure: 240, llm_google: 240, llm_groq: 240,
  pocketbase_get: 200, pocketbase_list: 200, pocketbase_create: 200, pocketbase_update: 200, pocketbase_delete: 200,
  neon_query: 240, mongodb_query: 240, supabase_query: 240, firebase_query: 240,
  json_parse: 160, transform: 180, filter: 160, aggregate: 180, merge: 200, split: 160, sort: 160, deduplicate: 160,
  http_request: 240, graphql: 220, send_email: 200, push_notification: 200, slack_message: 200, discord_message: 200,
  sms_twilio: 200, github_action: 220, notion_create: 220, file_upload: 180, webhook_send: 220, pdf_generate: 200, cloudinary_upload: 240,
  condition: 170, switch: 200, loop: 200, delay: 160, code: 200, retry: 200, try_catch: 200, parallel: 200, throttle: 170, dedup_events: 200,
  log: 160, webhook_response: 200, export_csv: 180, save_record: 180, return_data: 160, webhook_slack: 200,
}

const HANDLE_COLORS: Record<string, string> = {
  response: '#6c5ce7', stream: '#f59f00', prompt: '#6c5ce7', memory: '#339af0', tools: '#40c057',
  input: '#339af0', output: '#6c5ce7', error: '#e03131', success: '#40c057', failed: '#e03131',
  true: '#40c057', false: '#e03131', image: '#6c5ce7', analysis: '#6c5ce7', config: '#339af0',
  item: '#40c057', done: '#9898b0', result: '#40c057', exhausted: '#e03131', unique: '#40c057',
  duplicate: '#9898b0', sent: '#40c057', payload: '#40c057', event: '#f59f00', newly: '#40c057',
  try: '#f59f00', catch: '#e03131', array: '#e03131', message: '#f59f00', file: '#40c057',
  url: '#40c057', filter: '#339af0', dataset: '#339af0', query: '#339af0', source: '#339af0',
  merged: '#339af0', after: '#f59f00', complete: '#9898b0', branch: '#40c057',
}

function getHandleColor(handle: NodeHandle): string {
  return handle.color || HANDLE_COLORS[handle.id] || '#9898b0'
}

const nodeIcons: Record<string, React.ReactNode> = {
  webhook: <Webhook className="size-3.5" />, schedule: <Clock className="size-3.5" />,
  form_submit: <FileText className="size-3.5" />, email_in: <Mail className="size-3.5" />,
  db_watch: <Database className="size-3.5" />, custom_event: <Zap className="size-3.5" />,
  chat_trigger: <MessageCircle className="size-3.5" />,
  llm: <Brain className="size-3.5" />, llm_vision: <Cpu className="size-3.5" />,
  llm_tool_use: <Bot className="size-3.5" />,
  llm_local: <Server className="size-3.5" />, llm_azure: <Cloud className="size-3.5" />,
  llm_google: <Sparkles className="size-3.5" />, llm_groq: <Zap className="size-3.5" />,
  embed: <Code className="size-3.5" />, classify: <GitBranch className="size-3.5" />,
  extract: <FileText className="size-3.5" />, translate: <Globe className="size-3.5" />,
  summarize: <FileText className="size-3.5" />, rag_search: <Database className="size-3.5" />,
  image_gen: <Cpu className="size-3.5" />, audio_transcribe: <FileText className="size-3.5" />,
  http_request: <Globe className="size-3.5" />, graphql: <Globe className="size-3.5" />,
  send_email: <Mail className="size-3.5" />, push_notification: <Bell className="size-3.5" />,
  slack_message: <MessageSquare className="size-3.5" />, discord_message: <MessageSquare className="size-3.5" />,
  sms_twilio: <MessageSquare className="size-3.5" />, github_action: <Code className="size-3.5" />,
  notion_create: <FileText className="size-3.5" />, file_upload: <Download className="size-3.5" />,
  webhook_send: <Webhook className="size-3.5" />, pdf_generate: <FileText className="size-3.5" />,
  cloudinary_upload: <Cloud className="size-3.5" />,
  neon_query: <Table className="size-3.5" />, mongodb_query: <Database className="size-3.5" />,
  supabase_query: <Server className="size-3.5" />, firebase_query: <HardDrive className="size-3.5" />,
  condition: <ToggleLeft className="size-3.5" />, switch: <Route className="size-3.5" />,
  loop: <Repeat className="size-3.5" />, delay: <Clock className="size-3.5" />,
  code: <Code className="size-3.5" />, retry: <Repeat className="size-3.5" />,
  try_catch: <GitBranch className="size-3.5" />, parallel: <GitBranch className="size-3.5" />,
  throttle: <Clock className="size-3.5" />, dedup_events: <GitBranch className="size-3.5" />,
  log: <Logs className="size-3.5" />, webhook_response: <Webhook className="size-3.5" />,
  export_csv: <Download className="size-3.5" />, save_record: <Save className="size-3.5" />,
  return_data: <Save className="size-3.5" />, webhook_slack: <MessageSquare className="size-3.5" />,
}

function Bell(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> }

const positionMap: Record<string, Position> = {
  top: Position.Top, right: Position.Right, bottom: Position.Bottom, left: Position.Left,
}

function WorkflowNode({ data, selected }: NodeProps) {
  const color = getCategoryColor(data.category)
  const icon = nodeIcons[data.nodeType] || <Zap className="size-3.5" />
  const handles: NodeHandle[] = data.handles || []
  const nodeWidth = NODE_WIDTHS[data.nodeType] || 180

  const targetHandles = handles.filter(h => h.type === 'target')
  const sourceHandles = handles.filter(h => h.type === 'source')
  const hasCustomHandles = handles.length > 0

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div
        className={`torque-node rounded-xl border bg-card px-3 py-2.5 transition-all duration-150 relative ${
          selected ? 'border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10' : 'border-border hover:border-border/80'
        }`}
        style={{ minWidth: nodeWidth }}
      >
        {/* FALLBACK: default handles when no custom handles */}
        {!hasCustomHandles && (
          <>
            <Handle type="target" position={Position.Top} className="!bg-primary !border-2 !border-background" />
            <Handle type="source" position={Position.Bottom} className="!bg-primary !border-2 !border-background" />
          </>
        )}

        {/* CUSTOM TARGET HANDLES */}
        {hasCustomHandles && targetHandles.map((handle, i) => {
          const hc = getHandleColor(handle)
          const isLeft = handle.position === 'left'
          const isTop = handle.position === 'top'
          const isBottom = handle.position === 'bottom'
          const count = targetHandles.length
          const leftTargets = targetHandles.filter(h => h.position === 'left')
          const topTargets = targetHandles.filter(h => h.position === 'top')
          const bottomTargets = targetHandles.filter(h => h.position === 'bottom')
          const idx = isLeft ? leftTargets.indexOf(handle) : isTop ? topTargets.indexOf(handle) : bottomTargets.indexOf(handle)
          const total = isLeft ? leftTargets.length : isTop ? topTargets.length : bottomTargets.length
          const pct = total > 1 ? `${((idx + 1) / (total + 1)) * 100}%` : '50%'

          return (
            <div key={handle.id}>
              <Handle
                type="target"
                position={positionMap[handle.position]}
                id={handle.id}
                className="!border-2 !border-background !z-10"
                style={{
                  background: hc, width: 10, height: 10,
                  ...(isLeft ? { left: 0, top: pct } : {}),
                  ...(isTop ? { top: 0, left: pct } : {}),
                  ...(isBottom ? { bottom: 0, left: pct } : {}),
                }}
              />
              <div
                className="absolute pointer-events-none text-[8px] font-medium whitespace-nowrap"
                style={{
                  color: hc,
                  ...(isLeft ? { left: 14, top: pct, transform: 'translateY(-50%)' } : {}),
                  ...(isTop ? { top: -16, left: pct, transform: 'translateX(-50%)' } : {}),
                  ...(isBottom ? { bottom: -16, left: pct, transform: 'translateX(-50%)' } : {}),
                }}
              >
                {handle.label}
              </div>
            </div>
          )
        })}

        {/* NODE BODY */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-muted-foreground" style={{ color }}>{icon}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>
            {data.category}
          </span>
          {hasCustomHandles && (
            <span className="ml-auto text-[8px] text-muted-foreground/40">
              {targetHandles.length}in {sourceHandles.length}out
            </span>
          )}
        </div>

        <div className="text-sm font-medium text-foreground truncate">{data.label}</div>

        {/* Config previews inline */}
        {data.nodeType === 'llm' && data.config?.model && (
          <div className="text-[10px] text-muted-foreground mt-0.5 font-mono truncate">{data.config.model}</div>
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
          <div className="text-[10px] text-muted-foreground mt-0.5 font-mono truncate">{data.config.cron}</div>
        )}
        {data.nodeType === 'condition' && data.config?.expression && (
          <div className="text-[10px] text-muted-foreground mt-0.5 font-mono truncate">{data.config.expression}</div>
        )}
        {data.nodeType === 'chat_trigger' && data.config?.channel && (
          <div className="text-[10px] text-muted-foreground mt-0.5 font-mono truncate">{data.config.channel}</div>
        )}
        {(data.nodeType === 'neon_query' || data.nodeType === 'mongodb_query' || data.nodeType === 'supabase_query' || data.nodeType === 'firebase_query') && data.config?.collection && (
          <div className="text-[10px] text-muted-foreground mt-0.5 font-mono truncate">{data.config.collection || data.config.table || data.config.endpoint}</div>
        )}

        {/* CUSTOM SOURCE HANDLES */}
        {hasCustomHandles && sourceHandles.map((handle, i) => {
          const hc = getHandleColor(handle)
          const isRight = handle.position === 'right'
          const isBottom = handle.position === 'bottom'
          const leftSources = sourceHandles.filter(h => h.position === 'right')
          const bottomSources = sourceHandles.filter(h => h.position === 'bottom')
          const idx = isRight ? leftSources.indexOf(handle) : bottomSources.indexOf(handle)
          const total = isRight ? leftSources.length : bottomSources.length
          const pct = total > 1 ? `${((idx + 1) / (total + 1)) * 100}%` : '50%'

          return (
            <div key={handle.id}>
              <Handle
                type="source"
                position={positionMap[handle.position]}
                id={handle.id}
                className="!border-2 !border-background !z-10"
                style={{
                  background: hc, width: 10, height: 10,
                  ...(isRight ? { right: 0, top: pct } : {}),
                  ...(isBottom && !isRight ? { bottom: 0, left: pct } : {}),
                }}
              />
              <div
                className="absolute pointer-events-none text-[8px] font-medium whitespace-nowrap"
                style={{
                  color: hc,
                  ...(isRight ? { right: 14, top: pct, transform: 'translateY(-50%)' } : {}),
                  ...(isBottom && !isRight ? { bottom: -16, left: pct, transform: 'translateX(-50%)' } : {}),
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
