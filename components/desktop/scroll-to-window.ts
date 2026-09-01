import type { WindowId } from './types'

export function scrollToWindow(id: WindowId, reducedMotion: boolean) {
  document
    .getElementById(`window-${id}`)
    ?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
}
