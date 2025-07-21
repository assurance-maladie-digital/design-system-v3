<script setup lang="ts">
	import { vRgaaSvgFix } from '../../../directives/rgaaSvgFix'
	import { computed, onMounted, watch } from 'vue'

	/**
	 * Composant SyIcon - Affiche une icône avec gestion de l'accessibilité
	 *
	 * Ce composant permet d'afficher des icônes en gérant correctement leur accessibilité selon leur rôle :
	 * - Icônes décoratives : ignorées par les lecteurs d'écran (role="presentation", aria-hidden="true")
	 * - Icônes fonctionnelles : annoncées comme images (role="img", avec aria-label)
	 * - Icônes interactives : annoncées comme boutons (role="button", avec aria-label et tabindex)
	 *
	 * Le composant peut détecter automatiquement si une icône est interactive (bouton) en analysant
	 * la présence d'événements comme @click, @keydown, etc.
	 */

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
		role?: 'img' | 'button' | 'presentation'
		autoDetectButton?: boolean
		color?: string
		size?: string
	}>()

	// Configuration pour la directive rgaaSvgFix
	const rgaaSvgFixConfig = computed(() => {
		return {
			isDecorative: props.decorative,
			role: props.role,
			autoDetectButton: props.autoDetectButton,
		}
	})

	// Vérification à l'initialisation du composant
	onMounted(() => {
		checkAccessibility(props.icon, props.decorative, props.label)
	})

	// Vérification à chaque changement des props concernées
	watch(
		[() => props.decorative, () => props.label, () => props.icon],
		([decorative, label, icon]) => {
			checkAccessibility(
				icon as string,
				decorative as boolean | undefined,
				label as string | undefined,
			)
		},
	)
</script>

<template>
	<v-icon
		v-rgaa-svg-fix="rgaaSvgFixConfig"
		:color="props.color"
		:size="props.size"
		:aria-label="props.label"
	>
		{{ icon }}
	</v-icon>
</template>
