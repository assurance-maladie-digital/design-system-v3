/* eslint-disable vue/one-component-per-file */
import 'vuetify/styles'
import '@/assets/themes.scss'
import { mount } from 'cypress/vue'
import { createVuetifyInstance } from '@/vuetifyConfig'
import { VApp } from 'vuetify/components'
import { defineComponent, h, type Component } from 'vue'
import type { CyMountOptions } from 'cypress/vue'

// Noms des tasks enregistrés par le plugin @simonsmith/cypress-image-snapshot
const TASK_MATCH = 'Matching image snapshot'
const TASK_RECORD = 'Recording snapshot result'
const SNAPSHOTS_DIR = '__snapshots__'
const VISUAL_STABILITY_STYLE_ID = 'cy-visual-stability-style'

type SnapshotResult = {
	added?: boolean
	updated?: boolean
	pass?: boolean
	diffSize?: boolean
	diffOutputPath?: string
	diffRatio?: number
	diffPixelCount?: number
}

function getVisualSnapshotPaths(specRelative: string) {
	const lastSlashIndex = specRelative.lastIndexOf('/')
	const specDir = lastSlashIndex === -1 ? '' : specRelative.slice(0, lastSlashIndex)
	const snapshotRoot = specDir ? `${specDir}/${SNAPSHOTS_DIR}` : SNAPSHOTS_DIR

	return {
		baseDir: snapshotRoot,
		diffDir: `cypress/snapshots/diff/${specRelative}`,
	}
}

function ensureVisualStability() {
	return cy.document({ log: false }).then((doc) => {
		if (!doc.getElementById(VISUAL_STABILITY_STYLE_ID)) {
			const style = doc.createElement('style')
			style.id = VISUAL_STABILITY_STYLE_ID
			style.textContent = `
*,:before,:after {
	animation: none !important;
	transition: none !important;
	caret-color: transparent !important;
	scroll-behavior: auto !important;
}
	
svg {
  shape-rendering: geometricPrecision;
  text-rendering: geometricPrecision;
  image-rendering: pixelated;
}`
			doc.head.appendChild(style)
		}

		if (doc.fonts?.ready) {
			return doc.fonts.ready
		}
	})
		.then(() => {
			return cy.window({ log: false }).then(win => new Cypress.Promise<void>((resolve) => {
				win.requestAnimationFrame(() => win.requestAnimationFrame(() => resolve()))
			}))
		})
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
			matchImageSnapshot(name?: string, elem?: Cypress.Chainable<JQuery<HTMLElement>>): void
		}
	}
}

/**
 * Commande de comparaison de snapshots visuels
 * Reproduit la logique de addMatchImageSnapshotCommand sans import CJS top-level
 */
Cypress.Commands.add('matchImageSnapshot', (name?: string, elem?: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('body')) => {
	const screenshotName = name || Cypress.currentTest.titlePath.join(' -- ')
	const specRelative = Cypress.spec.relative
	const snapshotPaths = getVisualSnapshotPaths(specRelative)

	cy.env<{
		updateSnapshots?: boolean
		debugSnapshots?: boolean
		snapshotFailureThreshold?: number
	}>(['updateSnapshots', 'debugSnapshots', 'snapshotFailureThreshold']).then((env) => {
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

		// 2. Stabiliser le rendu (fonts + animations + paint) avant capture
		ensureVisualStability()

		// 2. Prendre le screenshot (le hook after:screenshot dans le plugin fait le diff)
		elem.screenshot(screenshotName, {
			capture: 'viewport',
			overwrite: true,
			disableTimersAndAnimations: true,
		})
	})

	// 3. Récupérer le résultat de la comparaison
	cy.task<SnapshotResult>(TASK_RECORD, null, { log: false }).then((result) => {
		if (!result) {
			throw new Error('Résultat de snapshot introuvable. Vérifier la configuration du plugin cypress-image-snapshot.')
		}

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
			const diffOutputPath = result.diffOutputPath || 'chemin de diff indisponible'
			const message = result.diffSize
				? `Taille d'image différente. Voir le diff : ${diffOutputPath}`
				: `Image différente de ${((result.diffRatio ?? 0) * 100).toFixed(2)}% (${result.diffPixelCount ?? 0} pixels).\nVoir le diff : ${diffOutputPath}`
			throw new Error(message)
		}
	})
})

type MountWithVuetifyOptions = CyMountOptions<Record<string, unknown>>
type MountWithVuetifyCommand = (component: Component, options?: MountWithVuetifyOptions) => ReturnType<typeof mount>

const mountComponent = mount as MountWithVuetifyCommand

function mountWithVuetify(component: Component, options: MountWithVuetifyOptions = {}) {
	const vuetify = createVuetifyInstance()

	// Extract slots from options: we handle them manually so mount()
	// does not try to attach them to the wrapper component.
	const { slots, ...mountOptions } = options

	const testComponent = defineComponent({
		inheritAttrs: false,
		setup(_, { attrs }) {
			return () => h(VApp, null, () =>
				h(component as Parameters<typeof h>[0], { ...attrs }, slots),
			)
		},
	})

	return mountComponent(testComponent, {
		...mountOptions,
		global: {
			...mountOptions.global,
			plugins: [
				...(mountOptions.global?.plugins || []),
				vuetify,
			],
			stubs: {
				'transition': true,
				'transition-group': true,
				...mountOptions.global?.stubs,
			},
		},
	})
}

Cypress.Commands.add('mountWithVuetify', mountWithVuetify)
