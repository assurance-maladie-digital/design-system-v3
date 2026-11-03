import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { appendFileSync, copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

// Validation ponctuelle sur une branche dédiée : les références sont restaurées.
assert.equal(process.env.CI, 'true', 'Cette validation doit être exécutée dans la CI Ubuntu.')
assert.equal(process.platform, 'linux', 'Les références doivent être comparées sous Linux.')

const spec = 'src/components/SyHeading/tests/SyHeading.visual.cy.ts'
const snapshotsDir = 'src/components/SyHeading/tests/__snapshots__'
const baseline = join(snapshotsDir, 'sy-heading-level-1.snap.png')
const diffDir = join('cypress/snapshots/diff', spec)
const evidenceDir = '.local/image-snapshot-validation'
mkdirSync(evidenceDir, { recursive: true })

const source = readFileSync(spec, 'utf8')
const originals = new Map(readdirSync(snapshotsDir)
	.filter(name => name.endsWith('.png'))
	.map(name => [join(snapshotsDir, name), readFileSync(join(snapshotsDir, name))]))
assert.equal(originals.size, 3, 'Les trois références SyHeading doivent être présentes.')
assert.ok(originals.has(baseline), 'La référence du premier titre doit exister.')

const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex')
const originalHash = hash(baseline)
copyFileSync(baseline, join(evidenceDir, 'before.png'))

function checkOriginalSnapshots() {
	for (const [file, buffer] of originals) {
		assert.deepEqual(readFileSync(file), buffer, `La référence ${file} a changé sans mise à jour explicite.`)
	}
	assert.equal(readdirSync(snapshotsDir).filter(name => name.endsWith('.png')).length, originals.size)
}

function runCypress(label, updateSnapshots = false) {
	const result = spawnSync('pnpm', [
		'exec', 'cypress', 'run', '--component', '--browser', 'electron', '--spec', spec,
		'--env', `updateSnapshots=${updateSnapshots},debugSnapshots=false`,
	], { encoding: 'utf8', timeout: 240_000, maxBuffer: 32 * 1024 * 1024 })
	const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`
	writeFileSync(join(evidenceDir, `${label}.log`), output)
	process.stdout.write(output)
	assert.ifError(result.error)
	assert.equal(result.signal, null, 'Cypress ne doit pas être interrompu.')
	return { status: result.status, output }
}

function report(message) {
	process.stdout.write(`${message}\n`)
	if (process.env.GITHUB_STEP_SUMMARY) {
		appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${message}\n\n`)
	}
}

try {
	const identical = runCypress('01-identical')
	assert.equal(identical.status, 0, 'Les références existantes doivent correspondre.')
	assert.doesNotMatch(identical.output, /Nouveau snapshot créé/)
	checkOriginalSnapshots()
	report('✅ Scénario 1 : les trois références existantes correspondent et restent inchangées.')

	const marker = '\t\tcy.matchImageSnapshot(\'sy-heading-level-1\', cy.get(\'.sy-heading\'))'
	assert.equal(source.split(marker).length, 2, 'La capture ciblée doit être unique.')
	writeFileSync(spec, source.replace(marker, [
		'\t\tcy.get(\'.sy-heading\')',
		'\t\t\t.invoke(\'css\', \'background-color\', \'#000\')',
		'\t\t\t.invoke(\'css\', \'color\', \'#fff\')',
		marker,
	].join('\n')))

	const different = runCypress('02-different')
	assert.equal(different.status, 1, 'La différence volontaire doit faire échouer un test.')
	assert.match(different.output, /Image différente de/)
	assert.ok(readdirSync(diffDir, { recursive: true }).some(name => name.endsWith('.diff.png')), 'Une image de diff doit être générée.')
	checkOriginalSnapshots()
	report('✅ Scénario 2 : le fond noir provoque un échec de comparaison et génère un diff, sans modifier les références.')

	const updated = runCypress('03-update', true)
	assert.equal(updated.status, 0, 'La mise à jour doit réussir.')
	assert.match(updated.output, /Snapshot mis à jour/)
	const updatedHash = hash(baseline)
	assert.notEqual(updatedHash, originalHash, 'La référence doit réellement être réécrite.')
	copyFileSync(baseline, join(evidenceDir, 'after.png'))
	for (const [file, buffer] of originals) {
		if (file !== baseline) assert.deepEqual(readFileSync(file), buffer)
	}

	const comparedAgain = runCypress('04-compare-updated')
	assert.equal(comparedAgain.status, 0, 'La nouvelle référence doit correspondre sans mode de mise à jour.')
	assert.equal(hash(baseline), updatedHash, 'La comparaison ne doit pas réécrire la référence.')
	assert.doesNotMatch(comparedAgain.output, /Nouveau snapshot créé|Snapshot mis à jour/)
	writeFileSync(join(evidenceDir, 'hashes.json'), JSON.stringify({ originalHash, updatedHash }, null, 2))
	report('✅ Scénario 3 : la référence change, puis la comparaison réussit avec cette nouvelle référence sans la réécrire.')
}
finally {
	writeFileSync(spec, source)
	for (const [file, buffer] of originals) writeFileSync(file, buffer)
	checkOriginalSnapshots()
	report('Le test et les références d’origine ont été restaurés. Les preuves sont disponibles dans les artefacts.')
}
