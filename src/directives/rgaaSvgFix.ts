/**
 * Directive Vue pour corriger les attributs d'accessibilité des SVG dans les icônes
 *
 * ## Pourquoi ce fichier a été créé
 *
 * Les icônes SVG nécessitent des attributs d'accessibilité spécifiques pour être correctement
 * interprétées par les technologies d'assistance (lecteurs d'écran, etc.).
 *
 * Cette directive applique automatiquement les bonnes pratiques d'accessibilité aux icônes SVG
 * en fonction de leur type (décorative, fonctionnelle ou interactive).
 *
 * ## Comment utiliser ce fichier
 *
 * ### Utilisation simple (booléen)
 * ```vue
 * <template>
 *   <!-- Icône décorative -->
 *   <div v-rgaa-svg-fix="true">
 *     <svg>...</svg>
 *   </div>
 *
 *   <!-- Icône fonctionnelle (img) -->
 *   <div
 *     v-rgaa-svg-fix="false"
 *     aria-label="Description de l'icône"
 *   >
 *     <svg>...</svg>
 *   </div>
 * </template>
 * ```
 *
 * ### Utilisation avancée (objet de configuration)
 * ```vue
 * <template>
 *   <!-- Icône décorative -->
 *   <div v-rgaa-svg-fix="{ isDecorative: true }">
 *     <svg>...</svg>
 *   </div>
 *
 *   <!-- Icône fonctionnelle avec rôle spécifique -->
 *   <div
 *     v-rgaa-svg-fix="{ isDecorative: false, role: 'img' }"
 *     aria-label="Description de l'icône"
 *   >
 *     <svg>...</svg>
 *   </div>
 *
 *   <!-- Icône interactive (bouton) -->
 *   <div
 *     v-rgaa-svg-fix="{ isDecorative: false, role: 'button' }"
 *     aria-label="Action du bouton"
 *     @click="handleClick"
 *   >
 *     <svg>...</svg>
 *   </div>
 *
 *   <!-- Icône avec détection automatique du rôle bouton -->
 *   <div
 *     v-rgaa-svg-fix="{ isDecorative: false, autoDetectButton: true }"
 *     aria-label="Action du bouton"
 *     @click="handleClick"
 *   >
 *     <svg>...</svg>
 *   </div>
 *
 *   <!-- Rendre uniquement les SVG internes décoratifs sans toucher au conteneur -->
 *   <div
 *     v-rgaa-svg-fix="{ onlyInner: true }"
 *     role="img"
 *     aria-label="Label géré par le conteneur"
 *   >
 *     <svg>...</svg>
 *   </div>
 * </template>
 * ```
 *
 * Cette directive respecte les normes RGAA (Référentiel Général d'Amélioration de l'Accessibilité).
 *
 * ## Comment fonctionne cette directive
 *
 * 1. La directive prend un paramètre qui peut être :
 *    - Un booléen indiquant si l'icône est décorative (true) ou fonctionnelle (false)
 *    - Un objet de configuration avec des options avancées (isDecorative, role, autoDetectButton, onlyInner)
 *
 * 2. Elle recherche tous les éléments SVG à l'intérieur de l'élément auquel elle est appliquée
 *
 * 3. Pour chaque SVG trouvé, elle corrige les attributs :
 *
 *    - Pour tous les éléments SVG, indépendamment du type d'icône :
 *      - Supprime systématiquement l'attribut `role="img"` du SVG
 *      - Ajoute systématiquement `aria-hidden="true"` au SVG
 *
 *    - Pour le conteneur parent, selon le type d'icône et la configuration :
 *      - Icônes décoratives :
 *        - Ajoute `role="presentation"` et `aria-hidden="true"` au conteneur parent
 *
 *      - Icônes fonctionnelles (non décoratives) :
 *        - Détermine le rôle approprié (img, button) selon la configuration ou la détection automatique
 *        - Ajoute le rôle approprié au conteneur parent
 *        - Ajoute un aria-label par défaut si aucun n'est présent
 *        - Supprime `aria-hidden="true"` du conteneur parent
 *
 *    - Cas particulier `onlyInner: true` :
 *      - Rend uniquement les SVG internes décoratifs (`role` supprimé, `aria-hidden="true"`)
 *      - Ne modifie AUCUN attribut du conteneur attaché à la directive
 *        (utile lorsque le conteneur porte déjà son propre rôle/label)
 *
 * 4. La directive s'applique au montage du composant et à chaque mise à jour
 *
 * ## Utilisation
 *
 * ```vue
 * <!-- Pour une icône décorative (par défaut) -->
 * <v-icon v-rgaa-svg-fix>mdi-account</v-icon>
 *
 * <!-- Pour une icône fonctionnelle sans label spécifique -->
 * <v-icon v-rgaa-svg-fix="false">mdi-account</v-icon>
 *
 * <!-- Pour une icône fonctionnelle avec un rôle spécifique -->
 * <v-icon
 *   v-rgaa-svg-fix="{ isDecorative: false, role: 'button' }"
 *   aria-label="Supprimer"
 * >
 *   mdi-delete
 * </v-icon>
 *
 * <!-- Pour une icône avec détection automatique du rôle bouton -->
 * <v-icon
 *   v-rgaa-svg-fix="{ autoDetectButton: true }"
 *   aria-label="Fermer"
 *   @click="close"
 * >
 *   mdi-close
 * </v-icon>
 *
 * <!-- Pour rendre les SVG internes décoratifs sans modifier le conteneur -->
 * <button
 *   v-rgaa-svg-fix="{ onlyInner: true }"
 *   aria-label="Fermer"
 *   @click="close"
 * >
 *   <svg>...</svg>
 * </button>
 * ```
 *
 * ## Recommandation
 *
 * Il est recommandé d'utiliser le composant `SyIcon` qui intègre déjà cette directive,
 * plutôt que d'appliquer manuellement la directive sur des `v-icon`.
 */
import type { Directive, DirectiveBinding } from 'vue'

/**
 * Type pour la configuration de la directive rgaaSvgFix
 */
interface RgaaSvgFixConfig {
	isDecorative?: boolean
	role?: 'presentation' | 'img' | 'button'
	autoDetectButton?: boolean
	/**
	 * Si `true`, rend uniquement les SVG internes décoratifs
	 * (`role` supprimé, `aria-hidden="true"`) sans modifier les attributs
	 * du conteneur attaché à la directive.
	 */
	onlyInner?: boolean
}

/**
 * Extrait et normalise la configuration à partir de la valeur de binding
 */
function parseConfig(binding: DirectiveBinding): RgaaSvgFixConfig {
	let config: RgaaSvgFixConfig = {
		isDecorative: true,
		autoDetectButton: false,
	}

	if (typeof binding.value === 'boolean') {
		config.isDecorative = binding.value
	}
	else if (typeof binding.value === 'object' && binding.value !== null) {
		config = { ...config, ...binding.value }

		// Fournir un rôle fonctionnel explicite implique une icône non décorative,
		// sauf si isDecorative est explicitement précisé par l'appelant.
		if (
			config.role
			&& config.role !== 'presentation'
			&& binding.value.isDecorative === undefined
		) {
			config.isDecorative = false
		}
	}

	return config
}

/**
 * Balises HTML nativement interactives (recevant le focus / déclenchant une action)
 */
const INTERACTIVE_TAGS = new Set([
	'button',
	'a',
	'input',
	'select',
	'textarea',
	'summary',
])

/**
 * Rôles ARIA correspondant à un widget interactif
 */
const INTERACTIVE_ROLES = new Set([
	'button',
	'link',
	'menuitem',
	'menuitemcheckbox',
	'menuitemradio',
	'tab',
	'checkbox',
	'radio',
	'switch',
	'option',
	'slider',
	'spinbutton',
])

/**
 * Sélecteur CSS regroupant les ancêtres considérés comme interactifs
 */
const INTERACTIVE_ANCESTOR_SELECTOR = 'button, a[href], [role="button"], [role="link"], [role="menuitem"], [role="tab"], summary'

/**
 * Détecte si un élément (ou son contexte) est interactif.
 *
 * Note : Vue compile les liaisons `@click` / `v-on:*` en écouteurs JavaScript
 * ajoutés via `addEventListener`. Il n'existe aucune API standard pour les
 * inspecter à l'exécution : ces liaisons ne sont donc pas détectables ici.
 * La détection se base sur tout ce qui est réellement observable dans le DOM :
 * balise native, rôle ARIA, focusabilité, édition, gestionnaires inline et
 * appartenance à un ancêtre interactif.
 */
function detectInteractivity(element: HTMLElement): boolean {
	const tag = element.tagName.toLowerCase()

	// Balise nativement interactive
	if (INTERACTIVE_TAGS.has(tag)) {
		// Un lien n'est interactif que s'il possède une cible (href)
		if (tag === 'a') {
			return element.hasAttribute('href')
		}

		return true
	}

	// Rôle ARIA interactif déjà présent
	const role = element.getAttribute('role')
	if (role !== null && INTERACTIVE_ROLES.has(role)) {
		return true
	}

	// Focusable explicitement
	if (element.hasAttribute('tabindex')) {
		return true
	}

	// Contenu éditable
	if (element.isContentEditable) {
		return true
	}

	// Gestionnaires d'événements inline (rares avec Vue mais possibles)
	if (
		element.onclick !== null
		|| element.onkeydown !== null
		|| element.onkeyup !== null
		|| element.onkeypress !== null
	) {
		return true
	}

	// Élément imbriqué dans un ancêtre interactif (ex : <svg> dans un <button>)
	return element.closest(INTERACTIVE_ANCESTOR_SELECTOR) !== null
}

/**
 * Corrige les attributs d'accessibilité des SVG en fonction de la configuration
 */
function fixSvgAttributes(el: HTMLElement, config: RgaaSvgFixConfig) {
	// Trouver tous les SVG dans l'élément
	const svgs = el.getElementsByTagName('svg')

	if (svgs.length > 0) {
		// Mode onlyInner : rendre uniquement les SVG internes décoratifs
		// sans modifier les attributs du conteneur attaché à la directive
		if (config.onlyInner) {
			for (let i = 0; i < svgs.length; i++) {
				const svg = svgs[i]!

				// Toujours supprimer role="img"
				svg.removeAttribute('role')
				// Toujours masquer le SVG
				svg.setAttribute('aria-hidden', 'true')
			}

			return
		}

		// Déterminer le rôle approprié pour l'élément
		let role: 'presentation' | 'img' | 'button' = 'presentation'
		let needsLabel = false

		if (!config.isDecorative) {
			// Si un rôle spécifique est fourni, l'utiliser
			if (config.role) {
				role = config.role
				needsLabel = true
			}
			else if (config.autoDetectButton && detectInteractivity(el)) {
				// Détection automatique du rôle bouton
				role = 'button'
				needsLabel = true
			}
			else {
				// Par défaut, une icône non décorative est une image
				role = 'img'
				needsLabel = true
			}
		}

		// Configurer le conteneur parent selon le rôle déterminé
		if (role === 'presentation') {
			// Pour les icônes décoratives, le conteneur doit être ignoré
			el.setAttribute('role', 'presentation')
			el.setAttribute('aria-hidden', 'true')
		}
		else {
			// Pour les icônes fonctionnelles, configurer selon le rôle
			el.setAttribute('role', role)

			// Ajouter un aria-label par défaut si aucun n'est présent
			if (needsLabel && !el.hasAttribute('aria-label')) {
				const defaultLabel = role === 'button' ? 'Cet élément est un bouton' : 'Cet élément est une icône'
				el.setAttribute('aria-label', defaultLabel)
			}

			// Supprimer aria-hidden s'il est présent
			el.removeAttribute('aria-hidden')

			// Si c'est un bouton, s'assurer qu'il est focusable
			if (role === 'button' && !el.hasAttribute('tabindex')) {
				el.setAttribute('tabindex', '0')
			}
		}

		// Corriger les attributs de chaque SVG
		for (let i = 0; i < svgs.length; i++) {
			const svg = svgs[i]!

			// Pour tous les SVG:
			// 1. Toujours supprimer role="img"
			svg.removeAttribute('role')
			// 2. Toujours masquer le SVG pour éviter un double énoncé, le conteneur porte le label si nécessaire
			svg.setAttribute('aria-hidden', 'true')
		}
	}
}

/**
 * Corrige les attributs d'accessibilité des SVG en fonction du type d'icône (décorative ou fonctionnelle)
 */
function applyFix(el: HTMLElement, binding: DirectiveBinding) {
	fixSvgAttributes(el, parseConfig(binding))
}

export const vRgaaSvgFix: Directive = {
	mounted: applyFix,
	updated: applyFix,
}
