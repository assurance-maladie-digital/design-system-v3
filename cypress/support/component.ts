import { createVuetifyInstance } from '@/vuetifyConfig'
import type { CyMountOptions } from 'cypress/vue'
import { mount } from 'cypress/vue'
import { defineComponent, h, type Component } from 'vue'
import { VApp } from 'vuetify/components'
import 'vuetify/styles'

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

function settleAnimations(doc: Document): void {
	// CSS animations cannot be neutralized by the injected `animation: none` style:
	// component scoped rules (higher specificity, `!important`) win the cascade.
	// Instead, fast-forward every finite animation to its end state (entrance
	// animations on messages, etc.) so captures are deterministic. Infinite
	// animations (spinners) are left untouched: finish() would throw on them.
	for (const animation of doc.getAnimations({ subtree: true })) {
		const iterations = animation.effect?.getComputedTiming().iterations ?? 1
		if (iterations === Number.POSITIVE_INFINITY) {
			continue
		}
		try {
			animation.finish()
		}
		catch {
			// Already finished or not finishable: nothing to settle.
		}
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
			return cy.document({ log: false }).then(doc => cy.window({ log: false }).then(win => new Cypress.Promise<void>((resolve) => {
				settleAnimations(doc)
				win.requestAnimationFrame(() => win.requestAnimationFrame(() => resolve()))
			})))
		})
}

// Déclarations de types pour les commandes Cypress personnalisées
type MatchImageSnapshotOptions = {
	/**
	 * Extra margin in px around an element capture. Needed when the focus ring
	 * (outline + offset) overflows the element bounding box and would be clipped
	 * by a plain element screenshot.
	 */
	padding?: number
}

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		interface Chainable {
			mountWithVuetify(
				component: Component,
				options?: CyMountOptions<Record<string, unknown>>
			): ReturnType<typeof mount>
			emulateMediaFeature(name: string, value: string): Cypress.Chainable<unknown>
			matchImageSnapshot(
				name?: string,
				elem?: Cypress.Chainable<JQuery<HTMLElement>>,
				opts?: MatchImageSnapshotOptions
			): void
		}
	}
}

/**
 * Commande de comparaison de snapshots visuels
 * Reproduit la logique de addMatchImageSnapshotCommand sans import CJS top-level
 */
Cypress.Commands.add('matchImageSnapshot', (name?: string, elem: Cypress.Chainable<JQuery<HTMLElement>> = cy.get<HTMLElement>('body'), opts: MatchImageSnapshotOptions = {}) => {
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
			// Small threshold: the capture area must stay tight around the component.
			// A loose capture (full viewport) dilutes the diff ratio and lets real
			// changes slip under the threshold.
			failureThreshold: 0.002,
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
			// Expand the captured area around the element: focus rings are drawn
			// outside the bounding box (outline-offset) and would be clipped
			// by a plain element screenshot.
			...(opts.padding ? { padding: opts.padding } : {}),
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

// Emulated media features in the AUT page, via the DevTools protocol
// (Emulation.setEmulatedMedia). `prefers-reduced-motion: reduce` is emulated by
// default for visual captures: JS-driven animations keyed on that media query
// never start. Vuetify in particular skips its WAAPI label float, which is
// scheduled from a rAF and could otherwise still be running during the
// screenshot (CI observed a field label frozen at its centered pre-animation
// position instead of floated). Rendered end states are unchanged, so existing
// baselines stay valid.
//
// The protocol call REPLACES the whole feature list, so every active feature
// must be sent together: tests emulate additional features (e.g. forced-colors)
// through the `emulateMediaFeature` command, which updates this registry.
const emulatedMediaFeatures = new Map<string, string>([
	['prefers-reduced-motion', 'reduce'],
])

function applyEmulatedMediaFeatures(): Promise<unknown> {
	return Cypress.automation('remote:debugger:protocol', {
		command: 'Emulation.setEmulatedMedia',
		params: { features: Array.from(emulatedMediaFeatures, ([name, value]) => ({ name, value })) },
	})
}

function mountWithVuetify(component: Component, options: MountWithVuetifyOptions = {}) {
	// Re-applied on every mount, so emulated media survive AUT page reloads
	// between spec files. cy.then queues the protocol call before mount() so no
	// cy command is invoked from a raw promise.
	return cy.then(() => applyEmulatedMediaFeatures()).then(() => {
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
	})
}

Cypress.Commands.add('mountWithVuetify', mountWithVuetify)

// Adds (or updates) an emulated media feature in the AUT page. Prefer this over
// a raw `Cypress.automation('remote:debugger:protocol', ...)` call: features are
// tracked centrally and re-sent together on every mount.
Cypress.Commands.add('emulateMediaFeature', (name: string, value: string) => {
	emulatedMediaFeatures.set(name, value)
	return cy.then(() => applyEmulatedMediaFeatures())
})
