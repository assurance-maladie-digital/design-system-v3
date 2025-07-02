import { computed } from 'vue'

/**
 * Composable pour gérer l'affichage d'un astérisque à côté du label
 * @param props - Les propriétés du composant contenant displayAsterisk et required
 * @param labelProp - Le nom de la propriété contenant le label (par défaut: 'label')
 * @returns Un objet contenant isShouldDisplayAsterisk et labelWithAsterisk
 */
export const useAsteriskDisplay = (
	props: { displayAsterisk?: boolean, required?: boolean, [key: string]: unknown },
	labelProp = 'label',
) => {
	// Détermine si l'astérisque doit être affiché
	const isShouldDisplayAsterisk = computed(() => {
		return props.displayAsterisk && props.required
	})

	// Ajoute l'astérisque au label si nécessaire
	const labelWithAsterisk = computed(() => {
		// Assertion de type pour indiquer que props[labelProp] est de type string | undefined
		const label = props[labelProp] as string | undefined
		return isShouldDisplayAsterisk.value && label
			? `${label} *`
			: label
	})

	return {
		isShouldDisplayAsterisk,
		labelWithAsterisk,
	}
}
