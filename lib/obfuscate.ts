/**
 * ROT13 codec for the build-obfuscated email (plan-performance-seo-privacy F6).
 * The generator (`scripts/generate-data.ts`) ships `EMAIL` / `PROFILE.email`
 * ROT13-encoded so the raw address never appears in served HTML;
 * client code decodes it only after hydration / on user interaction.
 */
export function rot13(input: string): string {
  return input.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= 'Z' ? 65 : 97
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base)
  })
}
