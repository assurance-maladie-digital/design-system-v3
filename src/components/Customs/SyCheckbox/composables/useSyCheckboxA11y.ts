import { nextTick, onMounted, onUpdated, type Ref } from 'vue'
import type { VCheckbox } from 'vuetify/components/VCheckbox'

/**
 * Composable gérant les corrections d'attributs ARIA sur l'input natif
 * généré par Vuetify, afin d'éviter les conflits et les attributs redondants.
 */
export function useSyCheckboxA11y(checkboxRef: Ref<VCheckbox | null>) {
	const removeAriaAttributes = () => {
		nextTick(() => {
			if (checkboxRef.value) {
				const checkboxInput = checkboxRef.value.$el?.querySelector('input[type="checkbox"]')
				if (checkboxInput) {
					// Supprimer aria-disabled="false" car il est redondant
					if (checkboxInput.getAttribute('aria-disabled') === 'false') {
						checkboxInput.removeAttribute('aria-disabled')
					}
					// Supprimer aria-checked natif de Vuetify pour éviter les conflits
					// Notre composant gère aria-checked au niveau du wrapper VCheckbox
					if (checkboxInput.hasAttribute('aria-checked')) {
						checkboxInput.removeAttribute('aria-checked')
					}
				}
			}
		})
	}

	onMounted(() => {
		removeAriaAttributes()
	})

	onUpdated(() => {
		removeAriaAttributes()
	})
}
