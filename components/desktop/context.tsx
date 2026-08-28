'use client'

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
} from 'react'
import {
  WINDOW_IDS,
  WINDOW_META,
  initialWindows,
  type Geometry,
  type Project,
  type ThemeId,
  type WindowId,
  type WindowState,
} from './types'

const STORAGE_KEY = 'ricey-desktop-v2'

export interface DesktopState {
  mode: 'desktop' | 'stack'
  area: { w: number; h: number }
  windows: Record<WindowId, WindowState>
  maxZ: number
  theme: ThemeId
  launcherOpen: boolean
  activeProject: Project | null
  hydrated: boolean
  /** true once the visitor drags/resizes/splits — their arrangement is kept */
  layoutDirty: boolean
}

export type DesktopAction =
  | {
      type: 'hydrate'
      windows: Record<WindowId, WindowState>
      theme: ThemeId
      layoutDirty: boolean
    }
  | { type: 'set-mode'; mode: 'desktop' | 'stack' }
  | { type: 'set-area'; w: number; h: number }
  | { type: 'focus'; id: WindowId }
  | { type: 'move'; id: WindowId; x: number; y: number }
  | { type: 'resize'; id: WindowId; w: number; h: number }
  | { type: 'toggle-minimize'; id: WindowId }
  | { type: 'toggle-maximize'; id: WindowId }
  | { type: 'close'; id: WindowId }
  | { type: 'open'; id: WindowId }
  | { type: 'open-project'; project: Project }
  | { type: 'split-windows'; left: WindowId; right: WindowId }
  | { type: 'set-theme'; theme: ThemeId }
  | { type: 'toggle-launcher'; open?: boolean }
  | { type: 'reset-layout' }

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max)

function reducer(state: DesktopState, action: DesktopAction): DesktopState {
  switch (action.type) {
    case 'hydrate':
      return {
        ...state,
        windows: action.windows,
        theme: action.theme,
        hydrated: true,
        layoutDirty: action.layoutDirty,
      }
    case 'set-mode':
      return { ...state, mode: action.mode }
    case 'set-area': {
      const area = { w: action.w, h: action.h }
      if (state.mode === 'stack' || !state.hydrated) return { ...state, area }
      if (!state.layoutDirty) {
        // Hyprland behavior: live re-tile whenever the area changes
        return { ...state, area, windows: initialWindows(action.w, action.h) }
      }
      // customized arrangement: keep it, just clamp into the new area
      const g = 12
      const windows = {} as Record<WindowId, WindowState>
      for (const id of WINDOW_IDS) {
        const win = state.windows[id]
        if (win.closed || win.maximized) {
          windows[id] = win
          continue
        }
        const maxW = Math.max(320, area.w - 2 * g)
        const maxH = Math.max(200, area.h - 2 * g)
        const w = Math.min(win.geom.w, maxW)
        const h = Math.min(win.geom.h, maxH)
        windows[id] = {
          ...win,
          geom: {
            ...win.geom,
            w,
            h,
            x: clamp(win.geom.x, -(w - 100), Math.max(g, area.w - 100)),
            y: clamp(win.geom.y, 0, Math.max(g, area.h - 40)),
          },
        }
      }
      return { ...state, area, windows }
    }
    case 'focus': {
      const win = state.windows[action.id]
      if (!win || win.z === state.maxZ) return state
      return {
        ...state,
        maxZ: state.maxZ + 1,
        windows: {
          ...state.windows,
          [action.id]: { ...win, z: state.maxZ + 1 },
        },
      }
    }
    case 'move': {
      const win = state.windows[action.id]
      const { minW } = WINDOW_META[action.id]
      const x = clamp(action.x, -(win.geom.w - 100), state.area.w - 100)
      const y = clamp(action.y, 0, Math.max(0, state.area.h - 40))
      return {
        ...state,
        layoutDirty: true,
        windows: {
          ...state.windows,
          [action.id]: {
            ...win,
            maximized: false,
            geom: { ...win.geom, x, y, w: Math.max(win.geom.w, minW) },
          },
        },
      }
    }
    case 'resize': {
      const win = state.windows[action.id]
      const { minW, minH } = WINDOW_META[action.id]
      const w = clamp(action.w, minW, Math.max(minW, state.area.w - win.geom.x))
      const h = clamp(action.h, minH, Math.max(minH, state.area.h - win.geom.y))
      return {
        ...state,
        layoutDirty: true,
        windows: {
          ...state.windows,
          [action.id]: { ...win, geom: { ...win.geom, w, h } },
        },
      }
    }
    case 'toggle-minimize': {
      const win = state.windows[action.id]
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...win, minimized: !win.minimized },
        },
      }
    }
    case 'toggle-maximize': {
      const win = state.windows[action.id]
      if (win.maximized) {
        const restore = win.restoreGeom ?? win.geom
        return {
          ...state,
          maxZ: state.maxZ + 1,
          windows: {
            ...state.windows,
            [action.id]: {
              ...win,
              maximized: false,
              geom: restore,
              z: state.maxZ + 1,
            },
          },
        }
      }
      return {
        ...state,
        maxZ: state.maxZ + 1,
        windows: {
          ...state.windows,
          [action.id]: {
            ...win,
            maximized: true,
            restoreGeom: win.geom,
            geom: { x: 0, y: 0, w: state.area.w, h: state.area.h },
            z: state.maxZ + 1,
          },
        },
      }
    }
    case 'close':
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...state.windows[action.id], closed: true },
        },
      }
    case 'open': {
      const win = state.windows[action.id]
      return {
        ...state,
        maxZ: state.maxZ + 1,
        windows: {
          ...state.windows,
          [action.id]: {
            ...win,
            closed: false,
            minimized: false,
            z: state.maxZ + 1,
          },
        },
      }
    }
    case 'open-project': {
      const win = state.windows['project-detail']
      return {
        ...state,
        activeProject: action.project,
        maxZ: state.maxZ + 1,
        windows: {
          ...state.windows,
          'project-detail': {
            ...win,
            closed: false,
            minimized: false,
            z: state.maxZ + 1,
          },
        },
      }
    }
    case 'split-windows': {
      // Hyprland-style split: left = focused window, right = picked window
      const g = 12
      const w = Math.floor((state.area.w - 3 * g) / 2)
      const h = state.area.h - 2 * g
      const left = state.windows[action.left]
      const right = state.windows[action.right]
      return {
        ...state,
        layoutDirty: true,
        maxZ: state.maxZ + 2,
        windows: {
          ...state.windows,
          [action.left]: {
            ...left,
            closed: false,
            minimized: false,
            maximized: false,
            geom: { x: g, y: g, w, h },
            z: state.maxZ + 1,
          },
          [action.right]: {
            ...right,
            closed: false,
            minimized: false,
            maximized: false,
            geom: { x: g + w + g, y: g, w, h },
            z: state.maxZ + 2,
          },
        },
      }
    }
    case 'set-theme':
      return { ...state, theme: action.theme }
    case 'toggle-launcher':
      return { ...state, launcherOpen: action.open ?? !state.launcherOpen }
    case 'reset-layout': {
      const fresh = initialWindows(state.area.w, state.area.h)
      return {
        ...state,
        windows: fresh,
        maxZ: WINDOW_IDS.length,
        activeProject: null,
        layoutDirty: false,
      }
    }
    default:
      return state
  }
}

interface DesktopContextValue extends DesktopState {
  dispatch: Dispatch<DesktopAction>
  reducedMotion: boolean
}

const DesktopContext = createContext<DesktopContextValue | null>(null)

export function useDesktop(): DesktopContextValue {
  const ctx = useContext(DesktopContext)
  if (!ctx) throw new Error('useDesktop must be used within DesktopProvider')
  return ctx
}

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    mode: 'desktop' as const,
    area: { w: 1400, h: 780 },
    windows: initialWindows(1400, 780),
    maxZ: WINDOW_IDS.length,
    theme: 'nord' as ThemeId,
    launcherOpen: false,
    activeProject: null,
    hydrated: false,
    layoutDirty: false,
  }))

  const [reducedMotion, setReducedMotion] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Hydrate persisted layout + theme
  useEffect(() => {
    try {
      localStorage.removeItem('ricey-desktop-v1')
      const raw = localStorage.getItem(STORAGE_KEY)
      let windows = initialWindows(state.area.w, state.area.h)
      let theme: ThemeId = 'nord'
      let layoutDirty = false
      const storedTheme = localStorage.getItem('ricey-theme')
      if (
        storedTheme === 'nord' ||
        storedTheme === 'gruvbox' ||
        storedTheme === 'sakura'
      ) {
        theme = storedTheme
      }
      if (raw) {
        // blob shape: { customized, windows }
        const saved = JSON.parse(raw) as {
          customized?: boolean
          windows?: Record<WindowId, WindowState>
        }
        layoutDirty = Boolean(saved.customized)
        if (layoutDirty && saved.windows) {
          const merged = {} as Record<WindowId, WindowState>
          for (const id of WINDOW_IDS) {
            const s = saved.windows[id]
            merged[id] =
              s && typeof s.geom?.x === 'number'
                ? { ...windows[id], ...s }
                : windows[id]
          }
          windows = merged
        }
      }
      dispatch({ type: 'hydrate', windows, theme, layoutDirty })
    } catch {
      dispatch({
        type: 'hydrate',
        windows: initialWindows(state.area.w, state.area.h),
        theme: 'nord',
        layoutDirty: false,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist layout (debounced) — customized flag decides retile-vs-restore
  useEffect(() => {
    if (!state.hydrated) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            customized: state.layoutDirty,
            windows: state.windows,
          }),
        )
      } catch {
        /* storage full/blocked — non-fatal */
      }
    }, 400)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [state.windows, state.layoutDirty, state.hydrated])

  // Persist theme
  useEffect(() => {
    if (!state.hydrated) return
    try {
      localStorage.setItem('ricey-theme', state.theme)
      document.documentElement.setAttribute('data-theme', state.theme)
    } catch {
      /* non-fatal */
    }
  }, [state.theme, state.hydrated])

  // Responsive mode + reduced motion
  useEffect(() => {
    const modeQuery = window.matchMedia('(max-width: 767px)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      dispatch({
        type: 'set-mode',
        mode: modeQuery.matches ? 'stack' : 'desktop',
      })
      setReducedMotion(motionQuery.matches)
    }
    apply()
    modeQuery.addEventListener('change', apply)
    motionQuery.addEventListener('change', apply)
    return () => {
      modeQuery.removeEventListener('change', apply)
      motionQuery.removeEventListener('change', apply)
    }
  }, [])

  return (
    <DesktopContext.Provider value={{ ...state, dispatch, reducedMotion }}>
      {children}
    </DesktopContext.Provider>
  )
}

export type { Geometry, Project, WindowId, WindowState }
