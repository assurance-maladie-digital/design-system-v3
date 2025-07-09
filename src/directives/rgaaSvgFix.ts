/**
 * Directive Vue pour corriger les attributs d'accessibilité des SVG dans les icônes
 *
 * ## Pourquoi ce fichier a été créé
 *
 * Cette directive a été créée pour résoudre un problème spécifique d'accessibilité avec les icônes SVG générées par Vuetify.
 * Le problème est que Vuetify génère des SVG avec des attributs ARIA contradictoires :
 * - Le conteneur `<v-icon>` a `role="presentation"` et `aria-hidden="true"` (pour les icônes décoratives)
 * - Mais le SVG à l'intérieur a `role="img"` et `aria-hidden="true"` simultanément
 *
 * Cette contradiction peut perturber les technologies d'assistance et ne respecte pas les normes RGAA
 * (Référentiel Général d'Amélioration de l'Accessibilité).
 *
 * ## Comment fonctionne cette directive
 *
 * 1. La directive prend un paramètre booléen qui indique si l'icône est décorative (true) ou fonctionnelle (false)
 * 2. Elle recherche tous les éléments SVG à l'intérieur de l'élément auquel elle est appliquée
 * 3. Pour chaque SVG trouvé, elle corrige les attributs :
 *
 *    - Pour tous les éléments SVG, indépendamment du type d'icône :
 *      - Supprime systématiquement l'attribut `role="img"` du SVG
 *      - Ajoute systématiquement `aria-hidden="true"` au SVG
 *
 *    - Pour le conteneur parent, selon le type d'icône :
 *      - Icônes décoratives (par défaut) :
 *        - Ajoute `role="presentation"` et `aria-hidden="true"` au conteneur parent
 *
 *      - Icônes fonctionnelles (quand binding.value === false) :
 *        - Ajoute `role="img"` au conteneur parent
 *        - Ajoute `aria-label="Icône"` au conteneur parent si aucun aria-label n'est présent
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
 * <!-- Pour une icône fonctionnelle avec un label personnalisé -->
 * <v-icon
 *   v-rgaa-svg-fix="false"
 *   aria-label="Profil utilisateur"
 * >
 *   mdi-account
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
 * Corrige les attributs d'accessibilité des SVG en fonction du type d'icône (décorative ou fonctionnelle)
 */
export const vRgaaSvgFix: Directive = {
	mounted(el: HTMLElement, binding: DirectiveBinding) {
		const isDecorative = binding.value !== false

		// Fonction pour corriger les attributs SVG
		const fixSvgAttributes = () => {
			// Trouver tous les SVG dans l'élément
			const svgs = el.getElementsByTagName('svg')

			if (svgs.length > 0) {
				// Configurer le conteneur parent selon le type d'icône
				if (isDecorative) {
					// Pour les icônes décoratives, le conteneur doit être ignoré
					el.setAttribute('role', 'presentation')
					el.setAttribute('aria-hidden', 'true')
				}
				else {
					// Pour les icônes fonctionnelles, le conteneur doit être annoncé
					el.setAttribute('role', 'img')
					// Ajouter un aria-label par défaut si aucun n'est présent
					if (!el.hasAttribute('aria-label')) {
						el.setAttribute('aria-label', 'Icône')
					}
					// Supprimer aria-hidden s'il est présent
					el.removeAttribute('aria-hidden')
				}

				// Corriger les attributs de chaque SVG
				for (let i = 0; i < svgs.length; i++) {
					const svg = svgs[i]

					// Pour tous les SVG:
					// 1. Toujours supprimer role="img"
					svg.removeAttribute('role')
					// 2. Toujours s'assurer que aria-hidden="true" est présent
					svg.setAttribute('aria-hidden', 'true')
				}
			}
		}

		// Appliquer les corrections au montage
		fixSvgAttributes()
	},
	updated(el: HTMLElement, binding: DirectiveBinding) {
		const isDecorative = binding.value !== false

		// Fonction pour corriger les attributs SVG
		const fixSvgAttributes = () => {
			// Trouver tous les SVG dans l'élément
			const svgs = el.getElementsByTagName('svg')

			if (svgs.length > 0) {
				// Configurer le conteneur parent selon le type d'icône
				if (isDecorative) {
					// Pour les icônes décoratives, le conteneur doit être ignoré
					el.setAttribute('role', 'presentation')
					el.setAttribute('aria-hidden', 'true')
				}
				else {
					// Pour les icônes fonctionnelles, le conteneur doit être annoncé
					el.setAttribute('role', 'img')
					// Ajouter un aria-label par défaut si aucun n'est présent
					if (!el.hasAttribute('aria-label')) {
						el.setAttribute('aria-label', 'Icône')
					}
					// Supprimer aria-hidden s'il est présent
					el.removeAttribute('aria-hidden')
				}

				// Corriger les attributs de chaque SVG
				for (let i = 0; i < svgs.length; i++) {
					const svg = svgs[i]

					// Pour tous les SVG:
					// 1. Toujours supprimer role="img"
					svg.removeAttribute('role')
					// 2. Toujours s'assurer que aria-hidden="true" est présent
					svg.setAttribute('aria-hidden', 'true')
				}
			}
		}

		// Appliquer les corrections à la mise à jour
		fixSvgAttributes()
	},
}
