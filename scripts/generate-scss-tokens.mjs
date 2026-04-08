import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { apVariantConfig, cnamVariantConfig, paVariantConfig } from './generate-scss-tokens.config.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const cache = new Map()

function toKebabCase(value) {
	return value
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/([a-zA-Z])(\d)/g, '$1-$2')
		.replace(/_/g, '-')
		.toLowerCase()
}

function toTokenSuffix(value) {
	return toKebabCase(value)
		.replace(/(darken|lighten)(\d+)$/, '$1-$2')
}

function formatColor(value) {
	if (typeof value !== 'string')
		return String(value)

	if (value.startsWith('#'))
		return value.toLowerCase()

	return value.replace(/,\s+/g, ', ').replace(/\s+/g, ' ')
}

function formatLength(value) {
	if (value === '0' || value === 0)
		return '0'

	if (typeof value === 'number')
		return `${value}px`

	return String(value)
}

function loadTsModule(filePath) {
	const normalizedPath = path.resolve(filePath)

	if (cache.has(normalizedPath))
		return cache.get(normalizedPath)

	const source = fs.readFileSync(normalizedPath, 'utf8')
	const transpiled = ts.transpileModule(source, {
		compilerOptions: {
			module: ts.ModuleKind.CommonJS,
			target: ts.ScriptTarget.ES2020,
			esModuleInterop: true,
		},
		fileName: normalizedPath,
	})

	const module = { exports: {} }
	const dirname = path.dirname(normalizedPath)

	const localRequire = (specifier) => {
		if (!specifier.startsWith('.'))
			throw new Error(`Unsupported import "${specifier}" in ${normalizedPath}`)

		const resolved = path.resolve(dirname, specifier.endsWith('.ts') ? specifier : `${specifier}.ts`)
		return loadTsModule(resolved)
	}

	const context = {
		module,
		exports: module.exports,
		require: localRequire,
		__dirname: dirname,
		__filename: normalizedPath,
		console,
	}

	vm.runInNewContext(transpiled.outputText, context, { filename: normalizedPath })
	cache.set(normalizedPath, module.exports)
	return module.exports
}

function createPrimitiveSection(colorsTokens) {
	const lines = ['// Primitives']

	for (const [colorName, scale] of Object.entries(colorsTokens)) {
		if (typeof scale !== 'object' || scale === null)
			continue

		const colorToken = toKebabCase(colorName)

		for (const [step, rawValue] of Object.entries(scale)) {
			const value = formatColor(rawValue)

			if (colorName === 'white') {
				if (step === 'base')
					lines.push(`$white-base: ${value};`)
				else if (step === 'lighten8')
					lines.push(`$white-08: ${value};`)
				else if (step === 'lighten20')
					lines.push(`$white-20: ${value};`)
				else if (step === 'lighten38')
					lines.push(`$white-38: ${value};`)
				else if (step === 'lighten40')
					lines.push(`$white-40: ${value};`)
				else if (step === 'lighten70')
					lines.push(`$white-70: ${value};`)
				continue
			}

			lines.push(`$${colorToken}-${toTokenSuffix(step)}: ${value};`)
		}
	}

	lines.push('$white-00: rgba(255, 255, 255, 0);')
	lines.push('$none-value: undefined;')
	lines.push('$transparent-blue-18: rgba(12, 65, 154, 0.18);')
	lines.push('$transparent-blue-08: rgba(12, 65, 154, 0.08);')
	lines.push('$transparent-blue-00: rgba(12, 65, 154, 0);')

	return lines
}

function createSemanticSection(variant) {
	const lines = ['', '// Semantic Tokens']
	const semanticValues = variant.semanticValues

	for (const [name, value] of Object.entries(semanticValues))
		lines.push(`$${name}: ${value};`)

	return lines
}

function createContextualSection(variant) {
	const { contextual, additionalContextual, includeContainerAliases } = variant
	const lines = ['', '// Contextual Tokens']

	lines.push(`$colors-background: ${formatColor(contextual.colors.background)};`)
	lines.push(`$colors-border: ${formatColor(contextual.colors.border)};`)
	lines.push(`$colors-text: ${formatColor(contextual.colors.text)};`)
	lines.push(`$colors-icon: ${formatColor(contextual.colors.icon)};`)
	lines.push(`$colors-overlay: ${formatColor(contextual.colors.overlay)};`)
	lines.push(`$colors-interactive: ${formatColor(contextual.colors.interactive)};`)

	for (const key of ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']) {
		const rawValue = key === '3' ? '12px' : contextual.gap[key]
		lines.push(`$gap-${key}: ${formatLength(rawValue)};`)
	}

	lines.push(`$icon-size-xsmall: ${formatLength(contextual.iconSize.xsmall)};`)
	lines.push(`$icon-size-small: ${formatLength(contextual.iconSize.small)};`)
	lines.push(`$icon-size-default: ${formatLength(contextual.iconSize.default)};`)
	lines.push(`$icon-size-large: ${formatLength(contextual.iconSize.large)};`)
	lines.push(`$radius-rounded-0: ${formatLength(contextual.radius.rounded0)};`)
	lines.push(`$radius-rounded: ${formatLength(contextual.radius.rounded)};`)
	lines.push(`$radius-rounded-md: ${formatLength(contextual.radius.rounded)};`)
	lines.push(`$radius-rounded-lg: ${formatLength(contextual.radius.roundedLg)};`)
	lines.push(`$radius-rounded-pill: ${formatLength(contextual.radius.roundedPill)};`)

	for (const key of ['0', '2', '3', '4', '6', '8', '10', '14', '16'])
		lines.push(`$padding-${key}: ${formatLength(contextual.padding[key])};`)

	lines.push(`$font-size-title: ${formatLength(contextual.fontSize.titres)};`)
	lines.push(`$font-size-alt-title: ${formatLength(contextual.fontSize.titresAlternatifs)};`)
	lines.push(`$font-size-body-text: ${formatLength(contextual.fontSize.corpsDeTexte)};`)
	lines.push(`$font-size-link-label: ${formatLength(contextual.fontSize.liensEtLibelles)};`)

	lines.push('', '// Additional Contextual Tokens')

	for (const [name, value] of Object.entries(additionalContextual))
		lines.push(`$${name}: ${value};`)

	if (includeContainerAliases) {
		lines.push('', '// vertical spacing')
		lines.push('$spacing-none: 0;')
		lines.push('$spacing-xx-small: 4px;')
		lines.push('$spacing-x-small: 8px;')
		lines.push('$spacing-small: 16px;')
		lines.push('$spacing-medium: 24px;')
		lines.push('$spacing-large: 32px;')
		lines.push('$spacing-x-large: 40px;')
		lines.push('$spacing-xx-large: 56px;')
		lines.push('$spacing-xxx-large: 64px;')
		lines.push('$spacing-huge: 80px;')
		lines.push('', '// horizontal spacing')
		lines.push('$spacing-horizontal-none: 0;')
		lines.push('$spacing-horizontal-xx-small: 4px;')
		lines.push('$spacing-horizontal-x-small: 8px;')
		lines.push('$spacing-horizontal-small: 16px;')
		lines.push('$spacing-horizontal-medium: 24px;')
		lines.push('$spacing-horizontal-large: 32px;')
		lines.push('$spacing-horizontal-x-large: 40px;')
		lines.push('$spacing-horizontal-xx-large: 56px;')
		lines.push('$spacing-horizontal-xxx-large: 64px;')
		lines.push('$spacing-horizontal-huge: 80px;')
		lines.push('', '// container')
		lines.push('$container-mobile-max-width: 600px;')
		lines.push('$container-tablet-max-width: 960px;')
		lines.push('$container-desktop-max-width: 960px;')
	}

	return lines
}

function buildVariant({ colors, contextual, semanticValues, additionalContextual, includeContainerAliases }) {
	const lines = [
		'/*',
		' * Generated from src/designTokens.',
		' * Do not edit this file manually.',
		' */',
		'',
		...createPrimitiveSection(colors),
		...createSemanticSection({ semanticValues }),
		...createContextualSection({ contextual, additionalContextual, includeContainerAliases }),
		'',
	]

	return `${lines.join('\n')}\n`
}

const cnamColors = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/cnam/cnamColors.ts')).cnamColorsTokens
const cnamContextual = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/cnam/cnamContextual.ts')).cnamContextualTokens
const paColors = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/pa/paColors.ts')).paColorsTokens
const paContextual = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/pa/paContextual.ts')).paContextualTokens
const apColors = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/amelipro/apColors.ts')).apColorsTokens
const apContextual = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/amelipro/apContextual.ts')).apContextualTokens

const cnamVariant = {
	colors: cnamColors,
	contextual: cnamContextual,
	...cnamVariantConfig,
}

const paVariant = {
	colors: paColors,
	contextual: paContextual,
	...paVariantConfig,
}

const apVariant = {
	colors: apColors,
	contextual: apContextual,
	...apVariantConfig,
}

fs.writeFileSync(path.join(rootDir, 'src/assets/tokens.generated.scss'), buildVariant(cnamVariant))
fs.writeFileSync(path.join(rootDir, 'src/assets/paTokens.generated.scss'), buildVariant(paVariant))
fs.writeFileSync(path.join(rootDir, 'src/assets/apTokens.generated.scss'), buildVariant(apVariant))
