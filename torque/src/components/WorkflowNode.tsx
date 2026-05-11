'use client'
import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { motion } from 'framer-motion'
import { getCategoryColor } from '@/lib/store'
import { NodeHandle } from '@/types/workflow'
import { Zap, Brain, Database, Play, GitBranch, Globe, Clock, Mail, MessageSquare, FileText, Code, ArrowLeftRight, Repeat, ToggleLeft, Webhook, Download, Save, Logs, Route, Cpu, Bot, Sparkles, Server, HardDrive, Cloud, MessageCircle, Table } from 'lucide-react'

const NODE_SIZE = {
  xs: { w: 140 },  // simple logic, output
  sm: { w: 170 },  // basic data, small actions
  md: { w: 210 },  // triggers, standard actions
  lg: { w: 260 },  // complex AI, DB nodes
  xl: { w: 310 },  // tool agent, big LLM
}

const NODE_TIERS: Record<string, { size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; tier: 1 | 2 | 3 | 4 | 5 }> = {
  // ═══ TIER 1 — output / simple logic (smallest) ═══
  log: { size: 'xs', tier: 1 },
  return_data: { size: 'xs', tier: 1 },
  delay: { size: 'xs', tier: 1 },
  throttle: { size: 'xs', tier: 1 },
  json_parse: { size: 'xs', tier: 1 },
  filter: { size: 'xs', tier: 1 },
  split: { size: 'xs', tier: 1 },
  sort: { size: 'xs', tier: 1 },
  deduplicate: { size: 'xs', tier: 1 },
  condition: { size: 'xs', tier: 1 },

  // ═══ TIER 2 — basic actions / data ═══
  export_csv: { size: 'sm', tier: 2 },
  save_record: { size: 'sm', tier: 2 },
  file_upload: { size: 'sm', tier: 2 },
  transform: { size: 'sm', tier: 2 },
  aggregate: { size: 'sm', tier: 2 },
  pocketbase_delete: { size: 'sm', tier: 2 },
  form_submit: { size: 'sm', tier: 2 },
  custom_event: { size: 'sm', tier: 2 },
  retry: { size: 'sm', tier: 2 },
  dedup_events: { size: 'sm', tier: 2 },
  send_email: { size: 'sm', tier: 2 },
  push_notification: { size: 'sm', tier: 2 },

  // ═══ TIER 3 — standard nodes ═══
  webhook: { size: 'md', tier: 3 },
  schedule: { size: 'md', tier: 3 },
  email_in: { size: 'md', tier: 3 },
  db_watch: { size: 'md', tier: 3 },
  chat_trigger: { size: 'md', tier: 3 },
  classify: { size: 'md', tier: 3 },
  extract: { size: 'md', tier: 3 },
  translate: { size: 'md', tier: 3 },
  summarize: { size: 'md', tier: 3 },
  embed: { size: 'md', tier: 3 },
  audio_transcribe: { size: 'md', tier: 3 },
  pocketbase_get: { size: 'md', tier: 3 },
  pocketbase_list: { size: 'md', tier: 3 },
  pocketbase_create: { size: 'md', tier: 3 },
  pocketbase_update: { size: 'md', tier: 3 },
  merge: { size: 'md', tier: 3 },
  graphql: { size: 'md', tier: 3 },
  slack_message: { size: 'md', tier: 3 },
  discord_message: { size: 'md', tier: 3 },
  sms_twilio: { size: 'md', tier: 3 },
  webhook_send: { size: 'md', tier: 3 },
  webhook_response: { size: 'md', tier: 3 },
  webhook_slack: { size: 'md', tier: 3 },
  notion_create: { size: 'md', tier: 3 },
  pdf_generate: { size: 'md', tier: 3 },
  code: { size: 'md', tier: 3 },
  switch: { size: 'md', tier: 3 },
  loop: { size: 'md', tier: 3 },
  try_catch: { size: 'md', tier: 3 },
  parallel: { size: 'md', tier: 3 },
  image_gen: { size: 'md', tier: 3 },
  github_action: { size: 'md', tier: 3 },
  cloudinary_upload: { size: 'md', tier: 3 },

  // ═══ TIER 4 — complex nodes (big) ═══
  llm: { size: 'lg', tier: 4 },
  llm_vision: { size: 'lg', tier: 4 },
  llm_local: { size: 'lg', tier: 4 },
  llm_azure: { size: 'lg', tier: 4 },
  llm_google: { size: 'lg', tier: 4 },
  llm_groq: { size: 'lg', tier: 4 },
  rag_search: { size: 'lg', tier: 4 },
  http_request: { size: 'lg', tier: 4 },
  neon_query: { size: 'lg', tier: 4 },
  mongodb_query: { size: 'lg', tier: 4 },
  supabase_query: { size: 'lg', tier: 4 },
  firebase_query: { size: 'lg', tier: 4 },

  // ═══ TIER 5 — most complex (extra large) ═══
  llm_tool_use: { size: 'xl', tier: 5 },
}

const TIER_STYLES: Record<number, { border: string; shadow: string; decor: string }> = {
  1: { border: 'border-[0.5px]', shadow: '', decor: 'opacity-40' },
  2: { border: 'border', shadow: '', decor: 'opacity-60' },
  3: { border: 'border', shadow: 'shadow-sm', decor: '' },
  4: { border: 'border-2', shadow: 'shadow-md', decor: 'ring-1 ring-white/5' },
  5: { border: 'border-2', shadow: 'shadow-lg', decor: 'ring-2 ring-primary/10' },
}

const HANDLE_COLORS: Record<string, string> = {
  response: '#6c5ce7', stream: '#f59f00', prompt: '#6c5ce7', memory: '#339af0', tools: '#40c057',
  input: '#339af0', output: '#6c5ce7', error: '#e03131', success: '#40c057', failed: '#e03131',
  true: '#40c057', false: '#e03131', image: '#6c5ce7', analysis: '#6c5ce7', config: '#339af0',
  item: '#40c057', done: '#9898b0', result: '#40c057', exhausted: '#e03131', unique: '#40c057',
  duplicate: '#9898b0', sent: '#40c057', payload: '#40c057', event: '#f59f00',
  message: '#f59f00', file: '#40c057', url: '#40c057', query: '#339af0', source: '#339af0',
  merged: '#339af0', after: '#f59f00', complete: '#9898b0', branch: '#40c057',
}

function getHandleColor(handle: NodeHandle): string {
  return handle.color || HANDLE_COLORS[handle.id] || '#9898b0'
}

const nodeIcons: Record<string, React.ReactNode> = {
  webhook: <Webhook />, schedule: <Clock />, form_submit: <FileText />, email_in: <Mail />,
  db_watch: <Database />, custom_event: <Zap />, chat_trigger: <MessageCircle />,
  llm: <Brain />, llm_vision: <Cpu />, llm_tool_use: <Bot />,
  llm_local: <Server />, llm_azure: <Cloud />, llm_google: <Sparkles />, llm_groq: <Zap />,
  embed: <Code />, classify: <GitBranch />, extract: <FileText />, translate: <Globe />,
  summarize: <FileText />, rag_search: <Database />, image_gen: <Cpu />, audio_transcribe: <FileText />,
  http_request: <Globe />, graphql: <Globe />, send_email: <Mail />, push_notification: <Bell />,
  slack_message: <MessageSquare />, discord_message: <MessageSquare />, sms_twilio: <MessageSquare />,
  github_action: <Code />, notion_create: <FileText />, file_upload: <Download />,
  webhook_send: <Webhook />, pdf_generate: <FileText />, cloudinary_upload: <Cloud />,
  neon_query: <Table />, mongodb_query: <Database />, supabase_query: <Server />, firebase_query: <HardDrive />,
  condition: <ToggleLeft />, switch: <Route />, loop: <Repeat />, delay: <Clock />,
  code: <Code />, retry: <Repeat />, try_catch: <GitBranch />, parallel: <GitBranch />,
  throttle: <Clock />, dedup_events: <GitBranch />,
  log: <Logs />, webhook_response: <Webhook />, export_csv: <Download />, save_record: <Save />,
  return_data: <Save />, webhook_slack: <MessageSquare />,
}

function Bell(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> }

const positionMap: Record<string, Position> = {
  top: Position.Top, right: Position.Right, bottom: Position.Bottom, left: Position.Left,
}

const ICON_SIZES: Record<number, string> = { 1: 'size-3', 2: 'size-3.5', 3: 'size-3.5', 4: 'size-4', 5: 'size-4' }
const CAT_LABEL_SIZES: Record<number, string> = { 1: 'text-[8px]', 2: 'text-[9px]', 3: 'text-[10px]', 4: 'text-[10px]', 5: 'text-[11px]' }
const LABEL_SIZES: Record<number, string> = { 1: 'text-[11px]', 2: 'text-xs', 3: 'text-sm', 4: 'text-sm', 5: 'text-base' }
const PADDINGS: Record<number, string> = { 1: 'px-2 py-1.5', 2: 'px-2.5 py-2', 3: 'px-3 py-2.5', 4: 'px-4 py-3', 5: 'px-4 py-3' }
const HANDLE_SIZES: Record<number, number> = { 1: 7, 2: 8, 3: 9, 4: 10, 5: 11 }

function WorkflowNode({ data, selected }: NodeProps) {
  const color = getCategoryColor(data.category)
  const meta = NODE_TIERS[data.nodeType] || { size: 'md' as const, tier: 3 }
  const dim = NODE_SIZE[meta.size]
  const tier = meta.tier
  const styles = TIER_STYLES[tier]
  const icon = nodeIcons[data.nodeType] || <Zap />
  const handles: NodeHandle[] = data.handles || []
  const targetHandles = handles.filter(h => h.type === 'target')
  const sourceHandles = handles.filter(h => h.type === 'source')
  const hasCustomHandles = handles.length > 0
  const hs = HANDLE_SIZES[tier]

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 450, damping: 28, mass: 0.4 }}
      whileHover={{ scale: 1.03 }}
    >
      <div
        className={`torque-node rounded-xl bg-card transition-all duration-150 relative ${styles.border} ${styles.shadow} ${styles.decor} ${
          selected
            ? '!border-primary !ring-2 !ring-primary/20 !shadow-lg !shadow-primary/10'
            : 'border-border hover:border-foreground/20'
        } ${PADDINGS[tier]}`}
        style={{ width: dim.w }}
      >
        {/* Default handles fallback */}
        {!hasCustomHandles && (
          <>
            <Handle type="target" position={Position.Top} className="!bg-primary !border-2 !border-background" style={{ width: hs, height: hs }} />
            <Handle type="source" position={Position.Bottom} className="!bg-primary !border-2 !border-background" style={{ width: hs, height: hs }} />
          </>
        )}

        {/* Custom target handles */}
        {hasCustomHandles && targetHandles.map((handle) => {
          const hc = getHandleColor(handle)
          const isLeft = handle.position === 'left'
          const isTop = handle.position === 'top'
          const isBottom = handle.position === 'bottom'
          const leftT = targetHandles.filter(h => h.position === 'left')
          const topT = targetHandles.filter(h => h.position === 'top')
          const botT = targetHandles.filter(h => h.position === 'bottom')
          const idx = isLeft ? leftT.indexOf(handle) : isTop ? topT.indexOf(handle) : botT.indexOf(handle)
          const total = isLeft ? leftT.length : isTop ? topT.length : botT.length
          const pct = total > 1 ? `${((idx + 1) / (total + 1)) * 100}%` : '50%'
          return (
            <div key={handle.id}>
              <Handle type="target" position={positionMap[handle.position]} id={handle.id}
                className="!border-2 !border-background !z-10"
                style={{ background: hc, width: hs, height: hs, ...(isLeft ? { left: -1, top: pct } : {}), ...(isTop ? { top: -1, left: pct } : {}), ...(isBottom ? { bottom: -1, left: pct } : {}) }}
              />
              <div className="absolute pointer-events-none text-[7px] font-medium whitespace-nowrap leading-none"
                style={{ color: hc, ...(isLeft ? { left: hs + 4, top: pct, transform: 'translateY(-50%)' } : {}), ...(isTop ? { top: -14, left: pct, transform: 'translateX(-50%)' } : {}), ...(isBottom ? { bottom: -14, left: pct, transform: 'translateX(-50%)' } : {}) }}
              >{handle.label}</div>
            </div>
          )
        })}

        {/* Category badge */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className="flex items-center justify-center" style={{ color }}>{icon}</span>
          <span className={`font-semibold uppercase tracking-wider ${CAT_LABEL_SIZES[tier]}`} style={{ color }}>{data.category}</span>
          {tier >= 4 && (
            <span className="ml-auto flex items-center gap-0.5">
              {Array.from({ length: tier - 2 }).map((_, i) => (
                <span key={i} className="size-1 rounded-full" style={{ background: color }} />
              ))}
            </span>
          )}
        </div>

        {/* Label */}
        <div className={`font-medium text-foreground leading-tight ${LABEL_SIZES[tier]}`}>{data.label}</div>

        {/* Config preview */}
        {data.nodeType === 'llm' && data.config?.model && (
          <div className={`text-muted-foreground mt-0.5 font-mono truncate ${tier >= 4 ? 'text-[10px]' : 'text-[9px]'}`}>{data.config.model}</div>
        )}
        {data.nodeType === 'http_request' && data.config?.url && (
          <div className={`text-muted-foreground mt-0.5 truncate font-mono ${tier >= 4 ? 'text-[10px]' : 'text-[9px]'}`}>
            <span className="text-[8px] font-semibold uppercase" style={{ color: data.config.method === 'POST' ? '#40c057' : data.config.method === 'DELETE' ? '#e03131' : '#339af0' }}>
              {data.config.method || 'GET'}
            </span> {data.config.url}
          </div>
        )}
        {(data.nodeType === 'schedule' || data.nodeType === 'delay') && data.config?.cron && (
          <div className="text-[9px] text-muted-foreground mt-0.5 font-mono truncate">{data.config.cron}</div>
        )}
        {data.nodeType === 'condition' && data.config?.expression && (
          <div className="text-[9px] text-muted-foreground mt-0.5 font-mono truncate">{data.config.expression}</div>
        )}

        {/* Custom source handles */}
        {hasCustomHandles && sourceHandles.map((handle) => {
          const hc = getHandleColor(handle)
          const isRight = handle.position === 'right'
          const isBottom = handle.position === 'bottom'
          const leftS = sourceHandles.filter(h => h.position === 'right')
          const botS = sourceHandles.filter(h => h.position === 'bottom')
          const idx = isRight ? leftS.indexOf(handle) : botS.indexOf(handle)
          const total = isRight ? leftS.length : botS.length
          const pct = total > 1 ? `${((idx + 1) / (total + 1)) * 100}%` : '50%'
          return (
            <div key={handle.id}>
              <Handle type="source" position={positionMap[handle.position]} id={handle.id}
                className="!border-2 !border-background !z-10"
                style={{ background: hc, width: hs, height: hs, ...(isRight ? { right: -1, top: pct } : {}), ...(isBottom && !isRight ? { bottom: -1, left: pct } : {}) }}
              />
              <div className="absolute pointer-events-none text-[7px] font-medium whitespace-nowrap leading-none"
                style={{ color: hc, ...(isRight ? { right: hs + 4, top: pct, transform: 'translateY(-50%)' } : {}), ...(isBottom && !isRight ? { bottom: -14, left: pct, transform: 'translateX(-50%)' } : {}) }}
              >{handle.label}</div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default memo(WorkflowNode)
