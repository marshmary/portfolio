'use client'

import { useRef, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { useDesktop } from './context'
import type { WindowId } from './types'

interface WindowProps {
  id: WindowId
  title: string
  children: ReactNode
  footer?: ReactNode
  bodyClassName?: string
  /** Stack-mode: card starts expanded */
  defaultStackOpen?: boolean
  /** Desktop-mode: open animation stagger (ms) */
  openDelay?: number
}

/**
 * Generic draggable/resizable glass window shell (DESIGN.md §5).
 * Desktop mode: drag via title bar, resize via bottom-right handle,
 * functional traffic lights, keyboard operable title bar.
 * Stack mode (<768px): full-width collapsible card.
 */
export function Window({
  id,
  title,
  children,
  footer,
  bodyClassName,
  defaultStackOpen = true,
  openDelay = 0,
}: WindowProps) {
  const { mode, area, windows, maxZ, dispatch, reducedMotion } = useDesktop()
  const win = windows[id]
  const [stackOpen, setStackOpen] = useState(defaultStackOpen)
  const dragRef = useRef<{
    startX: number
    startY: number
    origX: number
    origY: number
  } | null>(null)
  const resizeRef = useRef<{
    startX: number
    startY: number
    origW: number
    origH: number
  } | null>(null)

  const focused = win.z === maxZ && !win.minimized

  const onTitlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return
    dispatch({ type: 'focus', id })
    const el = e.currentTarget
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: win.geom.x,
      origY: win.geom.y,
    }
    el.setPointerCapture(e.pointerId)
    const onMove = (ev: PointerEvent) => {
      const d = dragRef.current
      if (!d) return
      dispatch({
        type: 'move',
        id,
        x: d.origX + (ev.clientX - d.startX),
        y: d.origY + (ev.clientY - d.startY),
      })
    }
    const onUp = () => {
      dragRef.current = null
      el.removeEventListener('pointermove', onMove)
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp, { once: true })
  }

  const onResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation()
    dispatch({ type: 'focus', id })
    const el = e.currentTarget
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origW: win.geom.w,
      origH: win.geom.h,
    }
    el.setPointerCapture(e.pointerId)
    const onMove = (ev: PointerEvent) => {
      const d = resizeRef.current
      if (!d) return
      dispatch({
        type: 'resize',
        id,
        w: d.origW + (ev.clientX - d.startX),
        h: d.origH + (ev.clientY - d.startY),
      })
    }
    const onUp = () => {
      resizeRef.current = null
      el.removeEventListener('pointermove', onMove)
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp, { once: true })
  }

  const onTitleKeyDown = (e: React.KeyboardEvent) => {
    if (mode !== 'desktop') return
    const step = e.shiftKey ? 1 : 16
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        dispatch({ type: 'move', id, x: win.geom.x, y: win.geom.y - step })
        break
      case 'ArrowDown':
        e.preventDefault()
        dispatch({ type: 'move', id, x: win.geom.x, y: win.geom.y + step })
        break
      case 'ArrowLeft':
        e.preventDefault()
        dispatch({ type: 'move', id, x: win.geom.x - step, y: win.geom.y })
        break
      case 'ArrowRight':
        e.preventDefault()
        dispatch({ type: 'move', id, x: win.geom.x + step, y: win.geom.y })
        break
      case 'Enter':
        e.preventDefault()
        dispatch({ type: 'toggle-maximize', id })
        break
      case ' ':
        e.preventDefault()
        dispatch({ type: 'toggle-minimize', id })
        break
    }
  }

  if (win.closed) return null

  if (mode === 'stack') {
    return (
      <section className="glass overflow-hidden" aria-label={title}>
        <div
          className="flex h-10 shrink-0 items-center gap-2 border-b px-3"
          style={{ borderColor: 'var(--border)' }}
        >
          <button
            type="button"
            onClick={() => setStackOpen(!stackOpen)}
            className="flex items-center gap-2 text-left"
            aria-expanded={stackOpen}
          >
            <motion.span
              animate={{ rotate: stackOpen ? 0 : -90 }}
              transition={{ duration: 0.15 }}
            >
              <ChevronDown
                className="h-4 w-4"
                style={{ color: 'var(--accent)' }}
              />
            </motion.span>
            <span className="text-xs" style={{ color: 'var(--faint)' }}>
              {title}
            </span>
          </button>
        </div>
        {stackOpen && (
          <div
            className={`overflow-y-auto p-4 font-mono text-[13px] leading-relaxed ${bodyClassName ?? ''}`}
          >
            {children}
          </div>
        )}
      </section>
    )
  }

  const geom = win.maximized ? { x: 0, y: 0, w: area.w, h: area.h } : win.geom

  return (
    <motion.div
      className={`glass absolute flex flex-col overflow-hidden ${focused ? 'glass-focus' : ''}`}
      style={{
        left: geom.x,
        top: geom.y,
        width: geom.w,
        height: geom.h,
        zIndex: 10 + win.z,
        visibility: win.minimized ? 'hidden' : 'visible',
        transition: reducedMotion
          ? 'none'
          : 'width 200ms ease-out, height 200ms ease-out, left 200ms ease-out, top 200ms ease-out',
      }}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
      animate={{
        opacity: win.minimized ? 0 : 1,
        scale: win.minimized ? 0.92 : 1,
        y: win.minimized ? 60 : 0,
      }}
      transition={{
        duration: reducedMotion ? 0 : 0.15,
        delay: reducedMotion ? 0 : openDelay / 1000,
      }}
      onPointerDown={() => dispatch({ type: 'focus', id })}
      role="region"
      aria-label={title}
    >
      {/* Title bar */}
      <div
        className="flex h-9 shrink-0 touch-none items-center gap-2 border-b px-3"
        style={{
          borderColor: 'var(--border)',
          background: 'color-mix(in srgb, var(--panel-solid) 40%, transparent)',
          cursor: 'grab',
        }}
        onPointerDown={onTitlePointerDown}
        onKeyDown={onTitleKeyDown}
        tabIndex={0}
        aria-label={`${title} window title bar. Arrow keys to move, Enter to maximize, Space to minimize.`}
        onDoubleClick={() => dispatch({ type: 'toggle-maximize', id })}
      >
        <div
          className="flex items-center gap-0.5"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="grid h-6 w-6 place-items-center rounded-full"
            onClick={() => dispatch({ type: 'close', id })}
            aria-label={`Close ${title}`}
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: 'var(--red)' }}
              aria-hidden
            />
          </button>
          <button
            type="button"
            className="grid h-6 w-6 place-items-center rounded-full"
            onClick={() => dispatch({ type: 'toggle-minimize', id })}
            aria-label={`Minimize ${title}`}
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: 'var(--yellow)' }}
              aria-hidden
            />
          </button>
          <button
            type="button"
            className="grid h-6 w-6 place-items-center rounded-full"
            onClick={() => dispatch({ type: 'toggle-maximize', id })}
            aria-label={`Maximize ${title}`}
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: 'var(--green)' }}
              aria-hidden
            />
          </button>
        </div>
        <span
          className={`mx-auto truncate text-xs ${focused ? '' : 'opacity-70'}`}
          style={{ color: focused ? 'var(--heading)' : 'var(--faint)' }}
        >
          {title}
          {win.maximized ? ' — maximized' : ''}
        </span>
        <span className="w-[52px] shrink-0" aria-hidden />
      </div>

      {/* Body */}
      <div
        className={`min-h-0 flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed ${bodyClassName ?? ''}`}
      >
        {children}
      </div>

      {/* Footer / status line */}
      {footer && (
        <div
          className="flex h-7 shrink-0 items-center border-t px-3 text-[11px]"
          style={{ borderColor: 'var(--border)', color: 'var(--faint)' }}
        >
          {footer}
        </div>
      )}

      {/* Resize handle */}
      {!win.maximized && (
        <div
          className="absolute right-0 bottom-0 h-4 w-4 cursor-nwse-resize touch-none"
          onPointerDown={onResizePointerDown}
          role="button"
          aria-label={`Resize ${title}`}
          tabIndex={-1}
        >
          <svg viewBox="0 0 16 16" className="h-full w-full" aria-hidden>
            <path
              d="M14 6 L6 14 M14 10 L10 14"
              stroke="var(--faint)"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>
      )}
    </motion.div>
  )
}
