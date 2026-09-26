/**
 * Build and TypeScript validation script for GhoulGrid Studio.
 * Verifies strict type-checking and production bundling without errors.
 */
import { execSync } from 'child_process'

console.log('🧪 [GhoulGrid] Starting strict validation test...')

try {
  console.log('1️⃣ Running strict TypeScript compilation (tsc -b)...')
  execSync('npx tsc -b', { stdio: 'inherit' })
  console.log('✅ TypeScript compilation passed cleanly!')

  console.log('2️⃣ Running Vite production build (vite build)...')
  execSync('npx vite build', { stdio: 'inherit' })
  console.log('✅ Production bundle built successfully!')

  console.log('🎉 All strict verification tests passed!')
  process.exit(0)
} catch (error) {
  console.error('❌ Validation failed:', error)
  process.exit(1)
}
