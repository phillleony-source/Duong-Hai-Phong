import { defineConfig, globalIgnores } from 'eslint/config'
import next from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

export default defineConfig([...next, ...typescript, globalIgnores([
  '.next/**', '.tooling/**', 'next-env.d.ts', 'src/payload-types.ts', 'src/migrations/**',
  'src/app/(payload)/admin/importMap.js', 'playwright-report/**', 'test-results/**',
])])
