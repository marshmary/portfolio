# Deferred Work

## Deferred from: code review of stories 1.1 & 1.2 (2026-06-06)

- Dark mode CSS `filter` on animated element causes continuous paint in dark mode — `saturate()` + `brightness()` filter combined with `background-position` animation forces full-viewport repaint every frame on low-end mobile devices. Fix requires pre-multiplying gradient colors for dark mode instead of using post-processing filter.
- MorphingDialog backdrop uses `bg-white/40 backdrop-blur-sm` which may show rainbow tint when opened in light mode — pre-existing dialog component transparency, not introduced by the gradient changes.
- Blog layout fixed top bar uses `bg-gray-100 to-transparent backdrop-blur-xl` which may show rainbow smear in light mode — pre-existing blog layout transparency, not introduced by the gradient changes.
- `themeColor` meta tag hardcoded to `#ffffff` in viewport export — always renders white browser chrome even in dark mode. Pre-existing issue not introduced by this diff.
