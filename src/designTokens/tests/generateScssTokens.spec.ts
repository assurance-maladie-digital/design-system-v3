import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { cnamContextualTokens } from '../tokens/cnam/cnamContextual'
import { paContextualTokens } from '../tokens/pa/paContextual'
import { apContextualTokens } from '../tokens/amelipro/apContextual'

const currentFile = fileURLToPath(import.meta.url)
const currentDir = path.dirname(currentFile)
const rootDir = path.resolve(currentDir, '../../..')

describe('generate-scss-tokens', () => {
	it('keeps canonical contextual gap values aligned across themes', () => {
		expect(cnamContextualTokens.gap[3]).toBe('12px')
		expect(paContextualTokens.gap[3]).toBe('12px')
		expect(apContextualTokens.gap[3]).toBe('12px')
	})

	it('generates compatibility scss files from design tokens', () => {
		execFileSync('node', ['./scripts/generate-scss-tokens.mjs'], {
			cwd: rootDir,
			stdio: 'pipe',
		})

		const tokensScss = fs.readFileSync(path.join(rootDir, 'src/assets/tokens.generated.scss'), 'utf8')
		const paTokensScss = fs.readFileSync(path.join(rootDir, 'src/assets/paTokens.generated.scss'), 'utf8')
		const apTokensScss = fs.readFileSync(path.join(rootDir, 'src/assets/apTokens.generated.scss'), 'utf8')

		expect(tokensScss).toContain('$gap-3: 12px;')
		expect(tokensScss).toContain('$colors-border-accent-primary: $primary-base;')
		expect(tokensScss).toContain('$heading-1-font-size: 24px;')

		expect(paTokensScss).toContain('$gap-3: 12px;')
		expect(paTokensScss).toContain('$colors-text-accent-primary: $primary-base;')
		expect(paTokensScss).toContain('$colors-overlay-onlight: $primary-base;')

		expect(apTokensScss).toContain('$gap-3: 12px;')
		expect(apTokensScss).toContain('$colors-text-accent-primary: $primary-base;')
		expect(apTokensScss).toContain('$colors-overlay-onlight: $neutral-white;')
	})
})
