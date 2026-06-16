/**
 * Génère les données d'utilisation des composants par les projets consommateurs,
 * par ANALYSE AST des imports réels (et non une simple recherche de texte).
 *
 * Multi-fournisseurs : GitHub ET GitLab (y compris une instance GitLab auto-hébergée).
 *
 * Étapes :
 *   1. Liste les composants publics (src/components/index.ts).
 *   2. Détermine les repos consommateurs, par fournisseur :
 *        - liste explicite, ou
 *        - auto-découverte : repos dont le package.json dépend du package.
 *   3. Clone (shallow) chaque repo, parse les fichiers .vue/.ts/.tsx/.js/.jsx avec
 *      le compilateur TypeScript, et compte les imports réels depuis `@cnamts/synapse`.
 *   4. Écrit src/usage/usage.json : pour chaque composant, nb de fichiers qui l'importent
 *      et la liste des repos.
 *
 * Configuration : variables d'environnement, chargées automatiquement depuis un fichier
 * `.env` à la racine du projet s'il existe (l'environnement réel reste prioritaire).
 *   Commun :
 *     - PACKAGE_NAME   : nom du package (défaut: @cnamts/synapse).
 *   GitHub :
 *     - GITHUB_TOKEN / GH_TOKEN : token (lecture repos de l'org) — requis pour découverte / repos privés.
 *     - GITHUB_ORG     : organisation (défaut: assurance-maladie-digital).
 *     - GITHUB_REPOS   : liste explicite "org/repo,org/repo" (court-circuite l'auto-découverte GitHub).
 *                        (alias rétro-compatible : CONSUMER_REPOS)
 *   GitLab :
 *     - GITLAB_TOKEN   : token (PRIVATE-TOKEN) — requis pour découverte / repos privés.
 *     - GITLAB_HOST    : hôte GitLab (défaut: gitlab.com ; ex. instance interne: gitlab.cnam.local).
 *     - GITLAB_GROUP   : groupe à analyser (sous-groupes inclus) pour l'auto-découverte.
 *     - GITLAB_PROJECTS: liste explicite "groupe/projet,groupe/sous-groupe/projet" (court-circuite la découverte GitLab).
 *
 * Sans aucune source configurée : le script n'échoue pas (conserve/crée un usage.json vide).
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, readdirSync, statSync, existsSync } from 'node:fs'
import { resolve, join, extname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)))
const componentsIndexPath = resolve(rootDir, 'src/components/index.ts')
const outDir = resolve(rootDir, 'src/usage')
const outFile = resolve(outDir, 'usage.json')

/**
 * Charge un fichier .env à la racine du projet (s'il existe) dans process.env.
 * Les variables déjà définies dans l'environnement réel ne sont pas écrasées
 * (l'environnement/CI a la priorité sur le .env local). Parseur minimal, sans dépendance.
 */
function loadDotEnv() {
	const envPath = resolve(rootDir, '.env')
	if (!existsSync(envPath)) return
	for (const rawLine of readFileSync(envPath, 'utf8').split('\n')) {
		const line = rawLine.trim()
		if (!line || line.startsWith('#')) continue
		const eq = line.indexOf('=')
		if (eq === -1) continue
		const key = line.slice(0, eq).replace(/^export\s+/, '').trim()
		if (!key || key in process.env) continue
		let value = line.slice(eq + 1).trim()
		if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
			value = value.slice(1, -1)
		}
		process.env[key] = value
	}
}

loadDotEnv()

const splitList = v => (v || '').split(',').map(s => s.trim()).filter(Boolean)

const PACKAGE_NAME = process.env.PACKAGE_NAME || '@cnamts/synapse'

// --- GitHub ---
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
const GITHUB_ORG = process.env.GITHUB_ORG || 'assurance-maladie-digital'
const GITHUB_REPOS = splitList(process.env.GITHUB_REPOS || process.env.CONSUMER_REPOS)

// --- GitLab ---
const GITLAB_TOKEN = process.env.GITLAB_TOKEN
const GITLAB_HOST = (process.env.GITLAB_HOST || 'gitlab.com').replace(/^https?:\/\//, '').replace(/\/+$/, '')
const GITLAB_GROUP = process.env.GITLAB_GROUP
const GITLAB_PROJECTS = splitList(process.env.GITLAB_PROJECTS)

const SOURCE_EXTENSIONS = new Set(['.vue', '.ts', '.tsx', '.js', '.jsx', '.mts', '.cts'])
const IGNORED_DIRS = new Set(['node_modules', 'dist', '.git', '.nuxt', '.output', 'coverage', 'storybook-static'])

/** Liste les composants exportés publiquement depuis src/components/index.ts. */
function getComponentNames() {
	const src = readFileSync(componentsIndexPath, 'utf8')
	const names = [...src.matchAll(/export\s*\{\s*default\s+as\s+(\w+)\s*\}/g)].map(m => m[1])
	return new Set(names)
}

/* ------------------------------------------------------------------ *
 * GitHub
 * ------------------------------------------------------------------ */

async function gh(path) {
	const res = await fetch(`https://api.github.com${path}`, {
		headers: {
			...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
			'Accept': 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
		},
	})
	if (!res.ok) throw new Error(`GitHub API ${res.status} ${res.statusText} (${path})`)
	return res.json()
}

function githubCloneUrl(fullName) {
	return GITHUB_TOKEN
		? `https://x-access-token:${GITHUB_TOKEN}@github.com/${fullName}.git`
		: `https://github.com/${fullName}.git`
}

/** Auto-découverte GitHub : repos de l'org dont le package.json dépend du package. */
async function discoverGithubRepos() {
	const repos = []
	let page = 1
	for (;;) {
		const batch = await gh(`/orgs/${GITHUB_ORG}/repos?per_page=100&page=${page}&type=all`)
		if (!Array.isArray(batch) || batch.length === 0) break
		repos.push(...batch.filter(r => !r.archived).map(r => r.full_name))
		if (batch.length < 100) break
		page++
	}

	const consumers = []
	for (const fullName of repos) {
		try {
			const file = await gh(`/repos/${fullName}/contents/package.json`)
			const pkg = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'))
			const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies }
			if (PACKAGE_NAME in deps) consumers.push({ fullName, cloneUrl: githubCloneUrl(fullName) })
		}
		catch {
			// pas de package.json à la racine ou repo inaccessible → on ignore
		}
	}
	return consumers
}

/* ------------------------------------------------------------------ *
 * GitLab (gitlab.com ou instance auto-hébergée via GITLAB_HOST)
 * ------------------------------------------------------------------ */

async function gl(path) {
	const res = await fetch(`https://${GITLAB_HOST}/api/v4${path}`, {
		headers: {
			...(GITLAB_TOKEN ? { 'PRIVATE-TOKEN': GITLAB_TOKEN } : {}),
			'Accept': 'application/json',
		},
	})
	if (!res.ok) throw new Error(`GitLab API ${res.status} ${res.statusText} (${path})`)
	return res.json()
}

/** Récupère le contenu brut d'un fichier d'un projet GitLab. */
async function glRawFile(projectId, filePath, ref) {
	const url = `https://${GITLAB_HOST}/api/v4/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}/raw?ref=${encodeURIComponent(ref)}`
	const res = await fetch(url, { headers: GITLAB_TOKEN ? { 'PRIVATE-TOKEN': GITLAB_TOKEN } : {} })
	if (!res.ok) throw new Error(`GitLab raw ${res.status} (${filePath})`)
	return res.text()
}

function gitlabCloneUrl(pathWithNamespace) {
	return GITLAB_TOKEN
		? `https://oauth2:${GITLAB_TOKEN}@${GITLAB_HOST}/${pathWithNamespace}.git`
		: `https://${GITLAB_HOST}/${pathWithNamespace}.git`
}

/** Auto-découverte GitLab : projets du groupe (sous-groupes inclus) dépendant du package. */
async function discoverGitlabRepos() {
	const projects = []
	let page = 1
	for (;;) {
		const batch = await gl(`/groups/${encodeURIComponent(GITLAB_GROUP)}/projects?include_subgroups=true&archived=false&per_page=100&page=${page}`)
		if (!Array.isArray(batch) || batch.length === 0) break
		projects.push(...batch)
		if (batch.length < 100) break
		page++
	}

	const consumers = []
	for (const p of projects) {
		try {
			const raw = await glRawFile(p.id, 'package.json', p.default_branch || 'main')
			const pkg = JSON.parse(raw)
			const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies }
			if (PACKAGE_NAME in deps) consumers.push({ fullName: p.path_with_namespace, cloneUrl: gitlabCloneUrl(p.path_with_namespace) })
		}
		catch {
			// pas de package.json à la racine ou projet inaccessible → on ignore
		}
	}
	return consumers
}

/* ------------------------------------------------------------------ *
 * Collecte des repos (toutes sources confondues)
 * ------------------------------------------------------------------ */

/** Renvoie la liste des repos à analyser : [{ fullName, cloneUrl }]. */
async function collectRepos() {
	const repos = []

	// GitHub
	if (GITHUB_REPOS.length) {
		repos.push(...GITHUB_REPOS.map(fullName => ({ fullName, cloneUrl: githubCloneUrl(fullName) })))
	}
	else if (GITHUB_TOKEN) {
		console.log(`GitHub : auto-découverte dans l'org ${GITHUB_ORG}...`)
		repos.push(...await discoverGithubRepos())
	}

	// GitLab
	if (GITLAB_PROJECTS.length) {
		repos.push(...GITLAB_PROJECTS.map(fullName => ({ fullName, cloneUrl: gitlabCloneUrl(fullName) })))
	}
	else if (GITLAB_TOKEN && GITLAB_GROUP) {
		console.log(`GitLab : auto-découverte dans le groupe ${GITLAB_GROUP} (${GITLAB_HOST})...`)
		repos.push(...await discoverGitlabRepos())
	}

	return repos
}

/** Libellés des sources configurées (pour le JSON / la page Adoption). */
function describeSources() {
	const sources = []
	if (GITHUB_REPOS.length) sources.push(`GitHub : ${GITHUB_REPOS.length} repo(s) explicite(s)`)
	else if (GITHUB_TOKEN) sources.push(`GitHub : org ${GITHUB_ORG}`)
	if (GITLAB_PROJECTS.length) sources.push(`GitLab : ${GITLAB_PROJECTS.length} projet(s) explicite(s) (${GITLAB_HOST})`)
	else if (GITLAB_TOKEN && GITLAB_GROUP) sources.push(`GitLab : groupe ${GITLAB_GROUP} (${GITLAB_HOST})`)
	return sources
}

/* ------------------------------------------------------------------ *
 * Clone + analyse AST
 * ------------------------------------------------------------------ */

/** Clone shallow d'un repo dans un dossier. */
function cloneRepo(cloneUrl, dest) {
	execFileSync('git', ['clone', '--depth', '1', '--quiet', cloneUrl, dest], { stdio: 'pipe' })
}

/** Parcourt récursivement les fichiers source d'un dossier. */
function* walkSourceFiles(dir) {
	for (const entry of readdirSync(dir)) {
		if (IGNORED_DIRS.has(entry)) continue
		const full = join(dir, entry)
		const stat = statSync(full)
		if (stat.isDirectory()) {
			yield* walkSourceFiles(full)
		}
		else if (SOURCE_EXTENSIONS.has(extname(entry))) {
			yield full
		}
	}
}

/** Extrait le code analysable d'un fichier (contenu des <script> pour les .vue). */
function extractScript(content, ext) {
	if (ext !== '.vue') return content
	const blocks = [...content.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)]
	return blocks.map(m => m[1]).join('\n')
}

/**
 * Analyse AST : renvoie l'ensemble des composants du package réellement importés dans le code.
 * Gère les imports nommés depuis le package et les imports (défaut/nommés) depuis un sous-chemin
 * `@cnamts/synapse/.../ComponentName`.
 */
function extractImportedComponents(code, ext, knownComponents) {
	const scriptKind = ext === '.tsx' || ext === '.jsx' ? ts.ScriptKind.TSX : ts.ScriptKind.TS
	let sourceFile
	try {
		sourceFile = ts.createSourceFile('file', code, ts.ScriptTarget.Latest, true, scriptKind)
	}
	catch {
		return new Set()
	}

	const imported = new Set()

	const visit = (node) => {
		if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
			const spec = node.moduleSpecifier.text
			const isPackage = spec === PACKAGE_NAME
			const isSubpath = spec.startsWith(`${PACKAGE_NAME}/`)

			if ((isPackage || isSubpath) && node.importClause) {
				const clause = node.importClause

				// Imports nommés : import { NirField, SyTextField as X } from '@cnamts/synapse'
				if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
					for (const el of clause.namedBindings.elements) {
						const name = (el.propertyName ?? el.name).text
						if (knownComponents.has(name)) imported.add(name)
					}
				}

				// Import par défaut depuis un sous-chemin : import NirField from '@cnamts/synapse/.../NirField.vue'
				if (clause.name && isSubpath) {
					const segment = spec.split('/').pop().replace(/\.(vue|ts|js|tsx|jsx)$/, '')
					if (knownComponents.has(segment)) imported.add(segment)
				}
			}
		}
		ts.forEachChild(node, visit)
	}

	visit(sourceFile)
	return imported
}

/** Analyse un repo cloné et met à jour l'agrégat. */
function analyzeRepo(repoDir, fullName, knownComponents, aggregate) {
	for (const file of walkSourceFiles(repoDir)) {
		let content
		try {
			content = readFileSync(file, 'utf8')
		}
		catch {
			continue
		}
		if (!content.includes(PACKAGE_NAME)) continue // court-circuit rapide

		const ext = extname(file)
		const components = extractImportedComponents(extractScript(content, ext), ext, knownComponents)

		for (const name of components) {
			if (!aggregate[name]) aggregate[name] = { imports: 0, repos: new Set() }
			aggregate[name].imports += 1 // 1 fichier importateur de plus
			aggregate[name].repos.add(fullName)
		}
	}
}

function writeEmptyScaffold() {
	mkdirSync(outDir, { recursive: true })
	if (!existsSync(outFile)) {
		writeFileSync(outFile, `${JSON.stringify({ generatedAt: null, package: PACKAGE_NAME, sources: [], components: {} }, null, 2)}\n`)
	}
}

async function main() {
	const knownComponents = getComponentNames()
	console.log(`${knownComponents.size} composants publics détectés.`)

	const repos = await collectRepos()
	if (repos.length === 0) {
		console.warn('\n⚠️  Aucun repo consommateur à analyser. Configurez au moins une source :')
		console.warn('   GitHub : GITHUB_TOKEN (auto-découverte de GITHUB_ORG) ou GITHUB_REPOS="org/repo,..."')
		console.warn('   GitLab : GITLAB_TOKEN + GITLAB_GROUP (+ GITLAB_HOST) ou GITLAB_PROJECTS="groupe/projet,..."\n')
		writeEmptyScaffold()
		return
	}
	console.log(`${repos.length} repo(s) à analyser : ${repos.map(r => r.fullName).join(', ')}`)

	const aggregate = {}
	const workspace = mkdtempSync(join(tmpdir(), 'synapse-usage-'))

	try {
		for (const { fullName, cloneUrl } of repos) {
			const dest = join(workspace, fullName.replace(/\//g, '__'))
			try {
				console.log(`  ⏳ clone ${fullName}...`)
				cloneRepo(cloneUrl, dest)
				analyzeRepo(dest, fullName, knownComponents, aggregate)
			}
			catch (err) {
				console.error(`  ✗ ${fullName}: ${err.message}`)
			}
			finally {
				rmSync(dest, { recursive: true, force: true })
			}
		}
	}
	finally {
		rmSync(workspace, { recursive: true, force: true })
	}

	// Sérialisation (Set → tableau trié)
	const components = {}
	for (const [name, data] of Object.entries(aggregate).sort(([, a], [, b]) => b.imports - a.imports)) {
		components[name] = { imports: data.imports, repos: [...data.repos].sort() }
	}

	const result = { generatedAt: new Date().toISOString(), package: PACKAGE_NAME, sources: describeSources(), components }
	mkdirSync(outDir, { recursive: true })
	writeFileSync(outFile, `${JSON.stringify(result, null, 2)}\n`)
	console.log(`\n✓ ${Object.keys(components).length} composants utilisés écrits dans ${outFile}`)
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
