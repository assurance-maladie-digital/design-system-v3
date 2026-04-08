import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

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

function getPath(object, pathParts) {
	return pathParts.reduce((current, key) => current?.[key], object)
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
const apColors = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/amelipro/apColors.ts')).apColorsTokens
const apContextual = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/amelipro/apContextual.ts')).apContextualTokens

const cnamVariant = {
	colors: cnamColors,
	contextual: cnamContextual,
	semanticValues: {
		'primary-darker-2': '$blue-darken-40',
		'primary-darker': '$blue-darken-20',
		'primary-base': '$blue-base',
		'primary': '$primary-base',
		'primary-light': '$blue-lighten-20',
		'primary-lighter-2': '$blue-lighten-60',
		'primary-lighter-3': '$blue-lighten-80',
		'primary-lighter-4': '$blue-lighten-90',
		'primary-lighter-5': '$blue-lighten-97',
		'secondary-darker-2': '$cyan-darken-40',
		'secondary-darker': '$cyan-darken-20',
		'secondary-base': '$cyan-base',
		'secondary-light': '$cyan-lighten-20',
		'secondary-lighter-2': '$cyan-lighten-60',
		'secondary-lighter-3': '$cyan-lighten-80',
		'secondary-lighter-4': '$cyan-lighten-90',
		'secondary-lighter-5': '$cyan-lighten-97',
		'neutral-black': '$grey-darken-60',
		'neutral-black-lighter': '$grey-base',
		'neutral-black-lighter-2': '$grey-lighten-40',
		'neutral-grey': '$grey-lighten-80',
		'neutral-white': '$white-base',
		'neutral-white-alpha': '$white-70',
		'neutral-white-alpha-lighter': '$white-40',
		'neutral-white-alpha-lighter-2': '$white-20',
		'neutral-white-alpha-lighter-3': '$white-08',
		'info-info-lightest': '$blue-lighten-90',
		'info-info-lighter': '$blue-lighten-80',
		'info-default': '$blue-base',
		'success-lightest': '$turquoise-lighten-90',
		'success-lighter': '$turquoise-lighten-80',
		'success-default': '$green-base',
		'success-darker': '$green-darken-60',
		'warning-lightest': '$yellow-lighten-90',
		'warning-lighter': '$yellow-lighten-80',
		'warning-default': '$yellow-base',
		'warning-darker': '$yellow-darken-60',
		'danger-lightest': '$orange-lighten-90',
		'danger-lighter': '$orange-lighten-80',
		'danger-default': '$orange-darken-20',
		'danger-darker': '$orange-darken-60',
		'user-professionnel': '$cyan-lighten-40',
		'user-assure': '$pink-lighten-40',
		'user-entreprise': '$yellow-base',
	},
	additionalContextual: {
		'colors-background-main': '$primary-lighter-4',
		'colors-background-surface': '$neutral-white',
		'colors-background-main-alt': '$neutral-white',
		'colors-background-main-ter': '$grey-lighten-97',
		'colors-background-surface-alt': '$primary-lighter-4',
		'colors-background-raised': '$primary-lighter-5',
		'colors-background-accent-primary': '$primary-base',
		'colors-background-accent-primary-contrasted': '$primary-darker-2',
		'colors-background-accent-primary-alt': '$grey-darken-80',
		'colors-background-accent-primary-light': '$primary-light',
		'colors-background-accent-secondary-light': '$secondary-lighter-2',
		'colors-background-accent-secondary': '$secondary-base',
		'colors-background-accent-secondary-contrasted': '$secondary-darker-2',
		'colors-background-info': '$info-info-lighter',
		'colors-background-info-subdued': '$info-info-lightest',
		'colors-background-info-contrasted': '$info-default',
		'colors-background-success': '$success-lighter',
		'colors-background-success-subdued': '$success-lightest',
		'colors-background-success-contrasted': '$success-default',
		'colors-background-warning': '$warning-lighter',
		'colors-background-warning-subdued': '$warning-lightest',
		'colors-background-warning-contrasted': '$warning-default',
		'colors-background-error': '$danger-lighter',
		'colors-background-error-subdued': '$danger-lightest',
		'colors-background-error-contrasted': '$danger-default',
		'colors-background-disabled': '$neutral-grey',
		'colors-background-disabled-ondark': '$neutral-white-alpha-lighter-3',
		'colors-background-assure': '$user-assure',
		'colors-background-professionnel': '$user-professionnel',
		'colors-background-entreprise': '$user-entreprise',
		'colors-border-darker': '$neutral-black',
		'colors-border-base': '$neutral-black-lighter-2',
		'colors-border-subdued': '$neutral-grey',
		'colors-border-accent-primary': '$primary-base',
		'colors-border-accent-primary-contrasted': '$primary-darker-2',
		'colors-border-accent-primary-ondark': '$neutral-white',
		'colors-border-accent-secondary': '$secondary-base',
		'colors-border-accent-secondary-contrasted': '$secondary-darker-2',
		'colors-border-info': '$info-default',
		'colors-border-success': '$success-darker',
		'colors-border-warning': '$warning-darker',
		'colors-border-error': '$danger-default',
		'colors-border-ondark': '$neutral-white-alpha',
		'colors-border-disabled': '$neutral-grey',
		'colors-border-disabled-ondark': '$neutral-white-alpha-lighter',
		'colors-text-base': '$neutral-black',
		'colors-text-accent-primary': '$primary-base',
		'colors-text-accent-primary-contrasted': '$primary-darker-2',
		'colors-text-accent-secondary': '$secondary-darker-2',
		'colors-text-subdued': '$neutral-black-lighter',
		'colors-text-info': '$info-default',
		'colors-text-success': '$success-darker',
		'colors-text-warning': '$warning-darker',
		'colors-text-error': '$danger-default',
		'colors-text-disabled': '$neutral-black-lighter-2',
		'colors-text-ondark': '$neutral-white',
		'colors-text-subdued-ondark': '$neutral-white-alpha',
		'colors-text-disabled-ondark': '$neutral-white-alpha-lighter',
		'colors-icon-base': '$neutral-black',
		'colors-icon-subdued': '$neutral-black-lighter',
		'colors-icon-subdued-ondark': '$neutral-white-alpha',
		'colors-icon-accent-primary': '$primary-base',
		'colors-icon-accent-primary-contrasted': '$primary-darker-2',
		'colors-icon-accent-secondary': '$secondary-darker-2',
		'colors-icon-info': '$info-default',
		'colors-icon-success': '$success-darker',
		'colors-icon-warning': '$warning-darker',
		'colors-icon-error': '$danger-default',
		'colors-icon-ondark': '$neutral-white',
		'colors-icon-disabled': '$neutral-black-lighter-2',
		'colors-icon-disabled-ondark': '$neutral-white-alpha-lighter',
		'colors-overlay-fullpage': '$neutral-black-lighter-2',
		'colors-overlay-ondark': '$neutral-white',
		'colors-overlay-onlight': '$primary-base',
		'colors-interactive-selection-enabled': '$white-00',
		'colors-interactive-selection-hover': '$primary-lighter-4',
		'colors-interactive-selection-pressed': '$primary-lighter-3',
		'colors-interactive-selection-selected': '$primary-lighter-4',
		'colors-interactive-selection-hover-on-selected': '$primary-lighter-3',
		'colors-interactive-selection-selected-accent': '$primary-base',
		'colors-interactive-selection-hover-on-selected-accent': '$primary-light',
		'colors-interactive-selection-disabled': '$white-00',
		'colors-interactive-positive-primary-action-enabled': '$primary-base',
		'colors-interactive-positive-primary-action-hover': '$primary-light',
		'colors-interactive-positive-primary-action-pressed': '$primary-lighter-2',
		'colors-interactive-positive-primary-action-disabled': '$neutral-grey',
		'colors-interactive-negative-primary-action-enabled': '$neutral-white',
		'colors-interactive-negative-primary-action-hover': '$primary-lighter-3',
		'colors-interactive-negative-primary-action-pressed': '$primary-lighter-2',
		'colors-interactive-negative-primary-action-disabled': '$neutral-grey',
		'colors-interactive-positive-secondary-action-enabled': '$white-00',
		'colors-interactive-positive-secondary-action-hover': '$primary-lighter-4',
		'colors-interactive-positive-secondary-action-pressed': '$primary-lighter-3',
		'colors-interactive-positive-secondary-action-disabled': '$white-00',
		'colors-interactive-negative-secondary-action-enabled': '$white-00',
		'colors-interactive-negative-secondary-action-hover': '$white-08',
		'colors-interactive-negative-secondary-action-pressed': '$white-20',
		'colors-interactive-negative-secondary-action-disabled': '$white-00',
		'heading-1-font-size': '24px',
		'heading-2-font-size': '20px',
		'heading-3-font-size': '16px',
		'heading-4-font-size': '14px',
	},
	includeContainerAliases: true,
}

const apVariant = {
	colors: apColors,
	contextual: apContextual,
	semanticValues: {
		'primary-darker-2': '$cyan-darken-60',
		'primary-darker': '$cyan-darken-40',
		'primary-base': '$cyan-darken-20',
		'primary': '$primary-base',
		'primary-light': '$cyan-base',
		'primary-lighter-2': '$cyan-lighten-20',
		'primary-lighter-3': '$cyan-lighten-40',
		'primary-lighter-4': '$cyan-lighten-90',
		'primary-lighter-5': '$cyan-lighten-97',
		'secondary-darker-2': '$cyan-darken-80',
		'secondary-darker': '$cyan-darken-80',
		'secondary-base': '$cyan-darken-60',
		'secondary-light': '$cyan-darken-20',
		'secondary-lighter-2': '$cyan-base',
		'secondary-lighter-3': '$cyan-lighten-20',
		'secondary-lighter-4': '$cyan-lighten-40',
		'secondary-lighter-5': '$cyan-lighten-60',
		'neutral-black': '$grey-darken-80',
		'neutral-black-lighter': '$grey-base',
		'neutral-black-lighter-2': '$grey-lighten-40',
		'neutral-grey': '$grey-lighten-80',
		'neutral-white': '$white-base',
		'neutral-white-alpha': '$white-70',
		'neutral-white-alpha-lighter': '$white-40',
		'neutral-white-alpha-lighter-2': '$white-20',
		'neutral-white-alpha-lighter-3': '$white-08',
		'info-info-lightest': '$parma-lighten-90',
		'info-info-lighter': '$parma-lighten-80',
		'info-default': '$parma-darken-40',
		'success-lightest': '$forest-green-lighten-97',
		'success-lighter': '$forest-green-lighten-90',
		'success-default': '$forest-green-base',
		'success-darker': '$forest-green-darken-40',
		'warning-lightest': '$yellow-lighten-90',
		'warning-lighter': '$yellow-lighten-80',
		'warning-default': '$yellow-base',
		'warning-darker': '$yellow-darken-60',
		'danger-lightest': '$red-lighten-90',
		'danger-lighter': '$red-lighten-80',
		'danger-default': '$red-darken-20',
		'danger-darker': '$red-darken-60',
		'user-professionnel': '$cyan-lighten-40',
		'user-assure': '$pink-lighten-40',
		'user-entreprise': '$yellow-base',
	},
	additionalContextual: {
		'colors-background-main': '$blue-lighten-90',
		'colors-background-surface': '$neutral-white',
		'colors-background-main-alt': '$neutral-white',
		'colors-background-surface-alt': '$blue-lighten-90',
		'colors-background-raised': '$cyan-lighten-97',
		'colors-background-accent-primary': '$primary-base',
		'colors-background-accent-primary-contrasted': '$primary-darker-2',
		'colors-background-accent-primary-alt': '$grey-base',
		'colors-background-accent-primary-light': '$primary-lighter-2',
		'colors-background-accent-secondary-light': '$secondary-lighter-2',
		'colors-background-accent-secondary': '$secondary-base',
		'colors-background-accent-secondary-contrasted': '$secondary-darker-2',
		'colors-background-info': '$blue-lighten-80',
		'colors-background-info-subdued': '$blue-lighten-90',
		'colors-background-info-contrasted': '$info-default',
		'colors-background-success': '$forest-green-lighten-80',
		'colors-background-success-subdued': '$success-lighter',
		'colors-background-success-contrasted': '$success-default',
		'colors-background-warning': '$warning-lighter',
		'colors-background-warning-subdued': '$warning-lightest',
		'colors-background-warning-contrasted': '$warning-default',
		'colors-background-error': '$danger-lighter',
		'colors-background-error-subdued': '$danger-lightest',
		'colors-background-error-contrasted': '$danger-default',
		'colors-background-disabled': '$neutral-grey',
		'colors-background-disabled-ondark': '$white-08',
		'colors-background-assure': '$user-assure',
		'colors-background-professionnel': '$user-professionnel',
		'colors-background-entreprise': '$user-entreprise',
		'colors-border-darker': '$grey-darken-60',
		'colors-border-base': '$neutral-black-lighter-2',
		'colors-border-subdued': '$neutral-grey',
		'colors-border-accent-primary': '$primary-base',
		'colors-border-accent-primary-contrasted': '$primary-darker',
		'colors-border-accent-primary-ondark': '$neutral-white',
		'colors-border-accent-secondary': '$secondary-base',
		'colors-border-accent-secondary-contrasted': '$secondary-darker-2',
		'colors-border-info': '$info-default',
		'colors-border-success': '$success-default',
		'colors-border-warning': '$warning-darker',
		'colors-border-error': '$danger-default',
		'colors-border-ondark': '$neutral-white-alpha',
		'colors-border-disabled': '$neutral-grey',
		'colors-border-disabled-ondark': '$neutral-white-alpha-lighter',
		'colors-text-base': '$grey-darken-60',
		'colors-text-accent-primary': '$primary-base',
		'colors-text-accent-primary-contrasted': '$primary-darker',
		'colors-text-accent-secondary': '$primary-darker',
		'colors-text-subdued': '$grey-base',
		'colors-text-info': '$info-default',
		'colors-text-success': '$success-default',
		'colors-text-warning': '$warning-darker',
		'colors-text-error': '$danger-default',
		'colors-text-disabled': '$neutral-black-lighter-2',
		'colors-text-ondark': '$neutral-white',
		'colors-text-subdued-ondark': '$neutral-white-alpha',
		'colors-text-disabled-ondark': '$neutral-white-alpha-lighter',
		'colors-icon-base': '$grey-darken-60',
		'colors-icon-subdued': '$grey-base',
		'colors-icon-subdued-ondark': '$neutral-white-alpha',
		'colors-icon-accent-primary': '$primary-base',
		'colors-icon-accent-primary-contrasted': '$primary-darker',
		'colors-icon-accent-secondary': '$primary-darker',
		'colors-icon-info': '$info-default',
		'colors-icon-success': '$success-default',
		'colors-icon-warning': '$warning-darker',
		'colors-icon-error': '$danger-default',
		'colors-icon-ondark': '$neutral-white',
		'colors-icon-disabled': '$neutral-black-lighter-2',
		'colors-icon-disabled-ondark': '$neutral-white-alpha-lighter',
		'colors-overlay-fullpage': '$grey-darken-60',
		'colors-overlay-ondark': '$primary-darker',
		'colors-overlay-onlight': '$neutral-white',
		'colors-interactive-selection-enabled': '$white-00',
		'colors-interactive-selection-hover': '$cyan-lighten-80',
		'colors-interactive-selection-pressed': '$cyan-lighten-60',
		'colors-interactive-selection-selected': '$cyan-lighten-80',
		'colors-interactive-selection-hover-on-selected': '$cyan-lighten-60',
		'colors-interactive-selection-selected-accent': '$primary-base',
		'colors-interactive-selection-hover-on-selected-accent': '$cyan-lighten-20',
		'colors-interactive-selection-disabled': '$white-00',
		'colors-interactive-positive-primary-action-enabled': '$primary-base',
		'colors-interactive-positive-primary-action-hover': '$cyan-lighten-20',
		'colors-interactive-positive-primary-action-pressed': '$cyan-lighten-40',
		'colors-interactive-positive-primary-action-disabled': '$neutral-grey',
		'colors-interactive-negative-primary-action-enabled': '$neutral-white',
		'colors-interactive-negative-primary-action-hover': '$cyan-lighten-60',
		'colors-interactive-negative-primary-action-pressed': '$cyan-lighten-40',
		'colors-interactive-negative-primary-action-disabled': '$neutral-grey',
		'colors-interactive-positive-secondary-action-enabled': '$white-00',
		'colors-interactive-positive-secondary-action-hover': '$cyan-lighten-97',
		'colors-interactive-positive-secondary-action-pressed': '$cyan-lighten-80',
		'colors-interactive-positive-secondary-action-disabled': '$white-00',
		'colors-interactive-negative-secondary-action-enabled': '$white-00',
		'colors-interactive-negative-secondary-action-hover': '$white-08',
		'colors-interactive-negative-secondary-action-pressed': '$white-20',
		'colors-interactive-negative-secondary-action-disabled': '$white-00',
	},
	includeContainerAliases: false,
}

fs.writeFileSync(path.join(rootDir, 'src/assets/tokens.generated.scss'), buildVariant(cnamVariant))
fs.writeFileSync(path.join(rootDir, 'src/assets/apTokens.generated.scss'), buildVariant(apVariant))
