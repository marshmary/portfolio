import type { PROJECTS } from '@/app/data'

/** The Project shape as generated into app/data.ts. */
export type Project = (typeof PROJECTS)[number]

export type ThemeId = 'nord' | 'gruvbox' | 'sakura'

export const THEMES: { id: ThemeId; label: string; dot: string }[] = [
  { id: 'nord', label: 'Nord', dot: '#88c0d0' },
  { id: 'gruvbox', label: 'Gruvbox', dot: '#fabd2f' },
  { id: 'sakura', label: 'Sakura', dot: '#ec6a88' },
]

export type WindowId =
  | 'about'
  | 'neofetch'
  | 'projects'
  | 'skills'
  | 'contact'
  | 'project-detail'

export const WINDOW_IDS: WindowId[] = [
  'about',
  'neofetch',
  'projects',
  'skills',
  'contact',
  'project-detail',
]

export interface Geometry {
  x: number
  y: number
  w: number
  h: number
}

export interface WindowState {
  geom: Geometry
  z: number
  minimized: boolean
  closed: boolean
  maximized: boolean
  restoreGeom?: Geometry
}

export const WINDOW_META: Record<
  WindowId,
  { label: string; title: string; minW: number; minH: number }
> = {
  about: {
    label: 'About',
    title: 'phu@site: ~/about',
    minW: 400,
    minH: 280,
  },
  neofetch: { label: 'Neofetch', title: 'neofetch', minW: 360, minH: 260 },
  projects: {
    label: 'Projects',
    title: 'phu@site: ~/projects',
    minW: 420,
    minH: 260,
  },
  skills: { label: 'Skills', title: 'btop — skills', minW: 460, minH: 240 },
  contact: {
    label: 'Contact',
    title: 'phu@site: ~/contact.sh',
    minW: 300,
    minH: 240,
  },
  'project-detail': {
    label: 'Project viewer',
    title: '~/projects',
    minW: 420,
    minH: 300,
  },
}

/**
 * Hyprland-style tiled layout (DESIGN.md §3) — fully adaptive: purely
 * proportional to the measured area, so it re-tiles correctly at ANY
 * screen size. Wide aspect → 3-column mosaic; squarer aspect → about
 * full-width row + 2×2 grid. Gap scales with the area (8–16px).
 * project-detail floats centered above the grid as a dialog.
 */
export function defaultLayout(
  areaW: number,
  areaH: number,
): Record<WindowId, Geometry> {
  const g = clampG(Math.round(Math.min(areaW, areaH) * 0.015))
  const detail: Geometry = {
    x: Math.round((areaW - Math.min(680, areaW - 2 * g)) / 2),
    y: Math.max(g, Math.round(areaH * 0.08)),
    w: Math.min(680, areaW - 2 * g),
    h: Math.min(540, areaH - 2 * g),
  }

  const wide = areaW >= 900 && areaW / areaH >= 1.3

  if (wide) {
    // 3-column mosaic: about spans full height; middle + right split in two rows
    const usable = areaW - 4 * g
    const colA = Math.round(usable * 0.34)
    const colB = Math.round(usable * 0.36)
    const colC = usable - colA - colB
    const rowH = Math.round((areaH - 3 * g) / 2)
    const x2 = g + colA + g
    const x3 = x2 + colB + g
    const y2 = g + rowH + g
    return {
      about: { x: g, y: g, w: colA, h: areaH - 2 * g },
      neofetch: { x: x2, y: g, w: colB, h: rowH },
      projects: { x: x2, y: y2, w: colB, h: rowH },
      skills: { x: x3, y: g, w: colC, h: rowH },
      contact: { x: x3, y: y2, w: colC, h: rowH },
      'project-detail': detail,
    }
  }

  // squarer aspect: about full-width row, then 2×2 grid
  const w2 = Math.floor((areaW - 3 * g) / 2)
  const rowH = Math.floor((areaH - 4 * g) / 3)
  const row2 = g + rowH + g
  const row3 = row2 + rowH + g
  const x2 = g + w2 + g
  return {
    about: { x: g, y: g, w: areaW - 2 * g, h: rowH },
    neofetch: { x: g, y: row2, w: w2, h: rowH },
    contact: { x: x2, y: row2, w: areaW - g - x2, h: rowH },
    projects: { x: g, y: row3, w: w2, h: rowH },
    skills: { x: x2, y: row3, w: areaW - g - x2, h: rowH },
    'project-detail': detail,
  }
}

function clampG(g: number): number {
  return Math.min(16, Math.max(8, g))
}

/** Focus priority: about gets the top z-index on first load. */
const INITIAL_Z: Record<WindowId, number> = {
  about: 6,
  neofetch: 5,
  projects: 4,
  skills: 3,
  contact: 2,
  'project-detail': 1,
}

export function initialWindows(
  areaW: number,
  areaH: number,
): Record<WindowId, WindowState> {
  const layout = defaultLayout(areaW, areaH)
  const windows = {} as Record<WindowId, WindowState>
  WINDOW_IDS.forEach((id) => {
    windows[id] = {
      geom: layout[id],
      z: INITIAL_Z[id],
      minimized: false,
      closed: id === 'project-detail',
      maximized: false,
    }
  })
  return windows
}
