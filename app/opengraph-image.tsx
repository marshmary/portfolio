import { ImageResponse } from 'next/og'

export const alt = 'Phu Tran — DevOps Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** Terminal-themed OG image (plan-performance-seo-privacy F3, DESIGN.md aesthetic). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#2e3440',
          color: '#d8dee9',
          padding: 72,
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 28,
            color: '#7b88a1',
          }}
        >
          <div style={{ display: 'flex', gap: 10 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                background: '#bf616a',
              }}
            />
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                background: '#ebcb8b',
              }}
            />
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                background: '#a3be8c',
              }}
            />
          </div>
          <div>phu@site: ~/about</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ display: 'flex', fontSize: 30, color: '#88c0d0' }}>
            <span>$</span>
            <span style={{ marginLeft: 12 }}>whoami</span>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 88,
              fontWeight: 700,
              color: '#eceff4',
            }}
          >
            Phu Tran
          </div>
          <div style={{ display: 'flex', fontSize: 40, color: '#d8dee9' }}>
            DevOps Engineer
          </div>
          <div style={{ display: 'flex', fontSize: 26, color: '#aebacf' }}>
            Automate everything. Monitor everything. Improve everything.
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 24, color: '#7b88a1' }}>
          portfolio.phutran.dev
        </div>
      </div>
    ),
    { ...size },
  )
}
