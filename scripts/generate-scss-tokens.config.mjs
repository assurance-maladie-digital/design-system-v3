// Variant configurations for the SCSS token generator.
// Token definitions live in src/designTokens/tokens/{brand}/variantConfig.ts
// This file is a thin assembler that re-exports them for the generator script.

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

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

const cnam = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/cnam/cnamVariantConfig.ts'))
const pa = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/pa/paVariantConfig.ts'))
const ap = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/amelipro/apVariantConfig.ts'))

export const cnamVariantConfig = {
	semanticValues: cnam.cnamSemanticValues,
	additionalContextual: cnam.cnamAdditionalContextual,
	includeContainerAliases: cnam.cnamIncludeContainerAliases,
}

export const paVariantConfig = {
	semanticValues: pa.paSemanticValues,
	additionalContextual: pa.paAdditionalContextual,
	includeContainerAliases: pa.paIncludeContainerAliases,
}

export const apVariantConfig = {
	semanticValues: ap.apSemanticValues,
	additionalContextual: ap.apAdditionalContextual,
	includeContainerAliases: ap.apIncludeContainerAliases,
}
