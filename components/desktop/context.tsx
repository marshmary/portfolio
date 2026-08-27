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
  defaultLayout,
  initialWindows,
  type Geometry,
  type Project,
  type ThemeId,
  type WindowId,
  type WindowState,
} from './types'

const STORAGE_KEY = 'ricey-desktop-v1'

export interface DesktopState {
  mode: 'desktop' | 'stack'
  area: { w: number; h: number }
  windows: Record<WindowId, WindowState>
  maxZ: number
  theme: ThemeId
  launcherOpen: boolean
  activeProject: Project | null
  hydrated: boolean
}

export type DesktopAction =
  | { type: 'hydrate'; windows: Record<WindowId, WindowState>; theme: ThemeId }
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
      }
    case 'set-mode':
      return { ...state, mode: action.mode }
    case 'set-area':
      return { ...state, area: { w: action.w, h: action.h } }
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
  }))

  const [reducedMotion, setReducedMotion] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Hydrate persisted layout + theme
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      let windows = initialWindows(state.area.w, state.area.h)
      let theme: ThemeId = 'nord'
      const storedTheme = localStorage.getItem('ricey-theme')
      if (
        storedTheme === 'nord' ||
        storedTheme === 'gruvbox' ||
        storedTheme === 'sakura'
      ) {
        theme = storedTheme
      }
      if (raw) {
        const saved = JSON.parse(raw) as Record<WindowId, WindowState>
        const merged = {} as Record<WindowId, WindowState>
        for (const id of WINDOW_IDS) {
          const s = saved[id]
          if (s && typeof s.geom?.x === 'number') {
            merged[id] = { ...windows[id], ...s }
          } else {
            merged[id] = windows[id]
          }
        }
        windows = merged
      }
      dispatch({ type: 'hydrate', windows, theme })
    } catch {
      dispatch({
        type: 'hydrate',
        windows: initialWindows(state.area.w, state.area.h),
        theme: 'nord',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist layout (debounced)
  useEffect(() => {
    if (!state.hydrated) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.windows))
      } catch {
        /* storage full/blocked — non-fatal */
      }
    }, 400)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [state.windows, state.hydrated])

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

  // Reset layout clamps saved windows to the measured area
  useEffect(() => {
    if (state.mode === 'stack' || !state.hydrated) return
    for (const id of WINDOW_IDS) {
      const win = state.windows[id]
      if (
        !win.closed &&
        !win.maximized &&
        (win.geom.x > state.area.w - 100 || win.geom.y > state.area.h - 40)
      ) {
        const fresh = defaultLayout(state.area.w, state.area.h)[id]
        dispatch({ type: 'move', id, x: fresh.x, y: fresh.y })
      }
    }
  }, [state.area, state.mode, state.hydrated]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <DesktopContext.Provider value={{ ...state, dispatch, reducedMotion }}>
      {children}
    </DesktopContext.Provider>
  )
}

export type { Geometry, Project, WindowId, WindowState }
