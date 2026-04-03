import { mount } from 'cypress/vue'
import { createVuetifyInstance } from '../../src/vuetifyConfig'
import type { Component } from 'vue'
import type { MountingOptions } from 'cypress/vue'
import 'vuetify/styles'
import '../../src/assets/themes.scss'

// Noms des tasks enregistrés par le plugin @simonsmith/cypress-image-snapshot
const TASK_MATCH = 'Matching image snapshot'
const TASK_RECORD = 'Recording snapshot result'

// Déclarations de types pour les commandes Cypress personnalisées
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		interface Chainable {
			mountWithVuetify<Props = Record<string, unknown>>(
				component: Component,
				options?: MountingOptions<Props>
			): Chainable<ReturnType<typeof mount>>
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

	const options = {
		screenshotsFolder: Cypress.config('screenshotsFolder') || 'cypress/snapshots/actual',
		isUpdateSnapshots: Cypress.env('updateSnapshots') || false,
		isSnapshotDebug: Cypress.env('debugSnapshots') || false,
		specFileRelativeToRoot: Cypress.spec.relative,
		e2eSpecDir: 'cypress/e2e/',
		currentTestTitle: Cypress.currentTest.title,
		failureThreshold: 0.01,
		failureThresholdType: 'percent' as const,
		snapFilenameExtension: '.snap',
		diffFilenameExtension: '.diff',
		isDeleteScreenshot: true,
		customSnapshotsDir: 'cypress/snapshots/base',
		customDiffDir: 'cypress/snapshots/diff',
	}

	// 1. Envoyer les options au plugin (active le mode snapshot)
	cy.task(TASK_MATCH, options, { log: false })

	// 2. Prendre le screenshot (le hook after:screenshot dans le plugin fait le diff)
	cy.screenshot(screenshotName, { capture: 'viewport', overwrite: true })

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

/**
 * Monte un composant Vue avec Vuetify pré-configuré (même config que la lib)
 */
Cypress.Commands.add(
	'mountWithVuetify',
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(component: Component, options: MountingOptions<any> = {}) => {
		const vuetify = createVuetifyInstance()

		return mount(component, {
			...options,
			global: {
				...options.global,
				plugins: [
					...(options.global?.plugins || []),
					vuetify,
				],
				stubs: {
					transition: false,
					'transition-group': false,
					...options.global?.stubs,
				},
			},
		})
	},
)
