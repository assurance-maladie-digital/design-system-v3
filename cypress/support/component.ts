import { mount } from 'cypress/vue'
import { createVuetifyInstance } from '@/vuetifyConfig'
import type { Component } from 'vue'
import type { CyMountOptions } from 'cypress/vue'
import 'vuetify/styles'
import '@/assets/themes.scss'

// Noms des tasks enregistrés par le plugin @simonsmith/cypress-image-snapshot
const TASK_MATCH = 'Matching image snapshot'
const TASK_RECORD = 'Recording snapshot result'
const SNAPSHOTS_DIR = '__snapshots__'

function getVisualSnapshotPaths(specRelative: string) {
	const lastSlashIndex = specRelative.lastIndexOf('/')
	const specDir = lastSlashIndex === -1 ? '' : specRelative.slice(0, lastSlashIndex)
	const snapshotRoot = specDir ? `${specDir}/${SNAPSHOTS_DIR}` : SNAPSHOTS_DIR

	return {
		baseDir: snapshotRoot,
		diffDir: `cypress/snapshots/diff/${specRelative}`,
	}
}

// Déclarations de types pour les commandes Cypress personnalisées
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		interface Chainable {
			mountWithVuetify(
				component: Component,
				options?: CyMountOptions<Record<string, unknown>>
			): ReturnType<typeof mount>
			matchImageSnapshot(name?: string): void
		}
	}
}

/**
 * Commande de comparaison de snapshots visuels
 * Reproduit la logique de addMatchImageSnapshotCommand sans import CJS top-level
 */
Cypress.Commands.add('matchImageSnapshot', (name?: string) => {
	const screenshotName = name || Cypress.currentTest.titlePath.join(' -- ')
	const specRelative = Cypress.spec.relative
	const snapshotPaths = getVisualSnapshotPaths(specRelative)

	cy.env<{
		updateSnapshots?: boolean
		debugSnapshots?: boolean
	}>(['updateSnapshots', 'debugSnapshots']).then((env) => {
		const options = {
			screenshotsFolder: Cypress.config('screenshotsFolder') || 'cypress/screenshots',
			isUpdateSnapshots: env.updateSnapshots ?? false,
			isSnapshotDebug: env.debugSnapshots ?? false,
			specFileRelativeToRoot: '',
			e2eSpecDir: specRelative,
			currentTestTitle: Cypress.currentTest.title,
			failureThreshold: 0.01,
			failureThresholdType: 'percent' as const,
			snapFilenameExtension: '.snap',
			diffFilenameExtension: '.diff',
			isDeleteScreenshot: true,
			customSnapshotsDir: snapshotPaths.baseDir,
			customDiffDir: snapshotPaths.diffDir,
		}

		// 1. Envoyer les options au plugin (active le mode snapshot)
		cy.task(TASK_MATCH, options, { log: false })

		// 2. Prendre le screenshot (le hook after:screenshot dans le plugin fait le diff)
		cy.screenshot(screenshotName, { capture: 'viewport', overwrite: true })
	})

	// 3. Récupérer le résultat de la comparaison
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	cy.task(TASK_RECORD, null, { log: false }).then((result: any) => {
		if (result.added) {
			Cypress.log({
				name: 'matchImageSnapshot',
				message: `Nouveau snapshot créé : ${screenshotName}`,
			})
			return
		}

		if (result.updated) {
			Cypress.log({
				name: 'matchImageSnapshot',
				message: `Snapshot mis à jour : ${screenshotName}`,
			})
			return
		}

		if (!result.pass) {
			const message = result.diffSize
				? `Taille d'image différente. Voir le diff : ${result.diffOutputPath}`
				: `Image différente de ${(result.diffRatio * 100).toFixed(2)}% (${result.diffPixelCount} pixels).\nVoir le diff : ${result.diffOutputPath}`
			throw new Error(message)
		}
	})
})

type MountWithVuetifyOptions = CyMountOptions<Record<string, unknown>>
type MountWithVuetifyCommand = (component: Component, options?: MountWithVuetifyOptions) => ReturnType<typeof mount>

const mountComponent = mount as MountWithVuetifyCommand

function mountWithVuetify(component: Component, options: MountWithVuetifyOptions = {}) {
	const vuetify = createVuetifyInstance()

	return mountComponent(component, {
		...options,
		global: {
			...options.global,
			plugins: [
				...(options.global?.plugins || []),
				vuetify,
			],
			stubs: {
				'transition': true,
				'transition-group': true,
				...options.global?.stubs,
			},
		},
	})
}

Cypress.Commands.add('mountWithVuetify', mountWithVuetify)
