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

const { buildVariant } = loadTsModule(path.join(rootDir, 'src/designTokens/builders/index.ts'))

const cnamColors = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/cnam/cnamColors.ts')).cnamColorsTokens
const cnamContextual = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/cnam/cnamContextual.ts')).cnamContextualTokens
const paColors = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/pa/paColors.ts')).paColorsTokens
const paContextual = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/pa/paContextual.ts')).paContextualTokens
const apColors = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/amelipro/apColors.ts')).apColorsTokens
const apContextual = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/amelipro/apContextual.ts')).apContextualTokens

fs.writeFileSync(
	path.join(rootDir, 'src/assets/tokens.generated.scss'),
	buildVariant({ colors: cnamColors, contextual: cnamContextual, ...cnamVariantConfig }),
)
fs.writeFileSync(
	path.join(rootDir, 'src/assets/paTokens.generated.scss'),
	buildVariant({ colors: paColors, contextual: paContextual, ...paVariantConfig }),
)
fs.writeFileSync(
	path.join(rootDir, 'src/assets/apTokens.generated.scss'),
	buildVariant({ colors: apColors, contextual: apContextual, ...apVariantConfig }),
)
