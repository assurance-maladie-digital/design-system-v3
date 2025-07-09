<script setup lang="ts">
	import { vRgaaSvgFix } from '../../../directives/rgaaSvgFix'
	import { onMounted, watch } from 'vue'

	/**
	 * Vérifie si une icône non décorative a un label
	 */
	const checkAccessibility = (icon: string, decorative: boolean | undefined, label: string | undefined) => {
		if (decorative === false && !label) {
			console.error(`L'icône "${icon}" n'est pas décorative, mais aucun texte alternatif (label) n'a été fourni.`)
		}
	}

	const props = defineProps<{
		icon: string
		label?: string
		decorative?: boolean
		color?: string
		size?: string
	}>()

	// Vérification à l'initialisation du composant
	onMounted(() => {
		checkAccessibility(props.icon, props.decorative, props.label)
	})

	// Vérification à chaque changement des props concernées
	watch(
		[() => props.decorative, () => props.label, () => props.icon],
		([decorative, label, icon]) => {
			checkAccessibility(icon as string, decorative as boolean | undefined, label as string | undefined)
		},
	)
</script>

<template>
	<v-icon
		v-rgaa-svg-fix="props.decorative"
		:color="props.color"
		:size="props.size"
		:role="props.decorative !== false ? undefined : 'img'"
		:aria-hidden="props.decorative !== false ? 'true' : undefined"
		:aria-label="props.decorative === false && props.label ? props.label : undefined"
	>
		{{ icon }}
	</v-icon>
</template>
