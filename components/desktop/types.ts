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

/** Hand-tuned cascaded default layout (DESIGN.md §3). */
export function defaultLayout(
  areaW: number,
  areaH: number,
): Record<WindowId, Geometry> {
  if (areaW >= 1200) {
    return {
      about: { x: 24, y: 16, w: 560, h: Math.min(460, areaH - 24) },
      neofetch: { x: 608, y: 16, w: 420, h: 410 },
      projects: {
        x: 24,
        y: Math.min(500, Math.max(16, areaH - 320)),
        w: Math.min(620, areaW - 700),
        h: 300,
      },
      skills: {
        x: 668,
        y: Math.min(456, Math.max(16, areaH - 350)),
        w: 560,
        h: 330,
      },
      contact: { x: areaW - 324, y: 16, w: 308, h: 310 },
      'project-detail': { x: 140, y: 90, w: 680, h: 500 },
    }
  }

  // 768–1199px: tidy 2-column grid
  const colW = Math.floor((areaW - 48) / 2)
  const topH = Math.floor(areaH * 0.44)
  const botH = Math.floor(areaH * 0.5)
  return {
    about: { x: 16, y: 8, w: colW, h: topH },
    neofetch: { x: 32 + colW, y: 8, w: colW, h: topH },
    contact: { x: 32 + colW, y: 16 + topH, w: colW, h: Math.floor(topH * 0.8) },
    projects: { x: 16, y: 24 + topH, w: colW, h: botH },
    skills: { x: 32 + colW, y: 24 + topH, w: colW, h: botH },
    'project-detail': {
      x: 60,
      y: 70,
      w: colW + 60,
      h: Math.floor(areaH * 0.6),
    },
  }
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
