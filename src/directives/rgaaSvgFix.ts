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
 * </template>
 * ```
 *
 * Cette directive respecte les normes RGAA (Référentiel Général d'Amélioration de l'Accessibilité).
 *
 * ## Comment fonctionne cette directive
 *
 * 1. La directive prend un paramètre qui peut être :
 *    - Un booléen indiquant si l'icône est décorative (true) ou fonctionnelle (false)
 *    - Un objet de configuration avec des options avancées (isDecorative, role, autoDetectButton)
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
	}

	return config
}

/**
 * Détecte si un élément a des attributs ou événements interactifs
 */
function detectInteractivity(element: HTMLElement): boolean {
	// Détection des attributs d'interactivité
	const hasTabindex = element.hasAttribute('tabindex')
	const hasClickHandler = element.hasAttribute('onclick')
		|| element.onclick !== null
	const hasKeyHandlers = element.hasAttribute('onkeydown')
		|| element.hasAttribute('onkeyup')
		|| element.hasAttribute('onkeypress')
		|| element.hasAttribute('@keydown')
		|| element.hasAttribute('@keyup')
		|| element.hasAttribute('@keypress')
		|| element.hasAttribute('v-on:keydown')
		|| element.hasAttribute('v-on:keyup')
		|| element.hasAttribute('v-on:keypress')
		|| element.onkeydown !== null
		|| element.onkeyup !== null
		|| element.onkeypress !== null

	// Vérifier si l'élément a des attributs data-* liés à des événements Vue
	const hasVueEvents = Array.from(element.attributes)
		.some(attr => attr.name.startsWith('data-v-on:')
			|| attr.name.startsWith('@')
			|| attr.name.startsWith('v-on:'))

	return hasTabindex || hasClickHandler || hasKeyHandlers || hasVueEvents
}

/**
 * Corrige les attributs d'accessibilité des SVG en fonction de la configuration
 */
function fixSvgAttributes(el: HTMLElement, config: RgaaSvgFixConfig) {
	// Trouver tous les SVG dans l'élément
	const svgs = el.getElementsByTagName('svg')

	if (svgs.length > 0) {
		// Déterminer le rôle approprié pour l'élément
		let role = 'presentation'
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
			const svg = svgs[i]

			// Pour tous les SVG:
			// 1. Toujours supprimer role="img"
			svg.removeAttribute('role')
			// 2. Toujours s'assurer que aria-hidden="true" est présent
			if (config.isDecorative) {
				svg.setAttribute('aria-hidden', 'true')
			}
			else {
				svg.removeAttribute('aria-hidden')
			}
		}
	}
}

/**
 * Corrige les attributs d'accessibilité des SVG en fonction du type d'icône (décorative ou fonctionnelle)
 */
export const vRgaaSvgFix: Directive = {
	mounted(el: HTMLElement, binding: DirectiveBinding) {
		// Extraire la configuration
		const config = parseConfig(binding)

		// Appliquer les corrections au montage
		fixSvgAttributes(el, config)
	},
	updated(el: HTMLElement, binding: DirectiveBinding) {
		// Extraire la configuration (identique au montage)
		const config = parseConfig(binding)

		// Appliquer les corrections à la mise à jour
		fixSvgAttributes(el, config)
	},
}
