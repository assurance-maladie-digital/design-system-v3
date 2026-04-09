import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'

const cache = new Map()

export function loadTsModule(filePath) {
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
