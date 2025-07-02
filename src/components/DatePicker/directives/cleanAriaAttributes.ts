/**
 * Directive pour nettoyer les attributs ARIA non valides ajoutés dynamiquement par Vuetify
 */

// Utiliser un WeakMap pour stocker les observers associés aux éléments
const observers = new WeakMap<HTMLElement, MutationObserver>()

export const vCleanAriaAttributes = {
	mounted(el: HTMLElement) {
		// Fonction pour nettoyer les attributs ARIA non valides
		const cleanAriaAttributes = () => {
			// Nettoyer les attributs ARIA sur le conteneur
			el.removeAttribute('aria-haspopup')
			el.removeAttribute('aria-expanded')
			el.removeAttribute('aria-controls')

			// Nettoyer les attributs ARIA sur les champs input
			const inputs = el.querySelectorAll('input')
			inputs.forEach(input => {
				input.removeAttribute('aria-expanded')
				input.removeAttribute('aria-haspopup')
				input.removeAttribute('aria-controls')
			})
		}

		// Nettoyer immédiatement les attributs ARIA
		cleanAriaAttributes()

		// Observer les changements d'attributs pour nettoyer dynamiquement
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'attributes' && 
					['aria-haspopup', 'aria-expanded', 'aria-controls'].includes(mutation.attributeName || '')) {
					// Nettoyer à nouveau les attributs ARIA
					cleanAriaAttributes()
				}
			})
		})

		// Observer les changements d'attributs sur l'élément et ses enfants
		observer.observe(el, {
			attributes: true,
			attributeFilter: ['aria-haspopup', 'aria-expanded', 'aria-controls'],
			subtree: true,
		})

		// Stocker l'observer dans le WeakMap pour pouvoir le déconnecter plus tard
		observers.set(el, observer)
	},

	// Déconnecter l'observer lorsque l'élément est démonté
	unmounted(el: HTMLElement) {
		const observer = observers.get(el)
		if (observer) {
			observer.disconnect()
			observers.delete(el)
		}
	},
}
