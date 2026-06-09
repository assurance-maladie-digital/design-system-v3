<script setup lang="ts">
	import type { ComponentPublicInstance } from 'vue'
	import type { IconValue } from 'vuetify/lib/composables/icons.mjs'
	import { vRgaaSvgFix } from '@/directives/rgaaSvgFix'
	import { computed, onMounted, onUpdated, ref, watch } from 'vue'

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
	const checkAccessibility = (icon: IconValue, decorative: boolean | undefined, label: string | undefined) => {
		if (decorative === false && !label) {
			console.error(`L'icône "${icon}" n'est pas décorative, mais aucun texte alternatif (label) n'a été fourni.`)
		}
	}

	const props = defineProps<{
		icon: IconValue
		label?: string
		decorative?: boolean
		role?: 'img' | 'button' | 'presentation'
		autoDetectButton?: boolean
		color?: string
		size?: string
		width?: string
	}>()

	const resolvedDecorative = computed(() => props.decorative ?? true)

	// Configuration pour la directive rgaaSvgFix
	const rgaaSvgFixConfig = computed(() => {
		return {
			isDecorative: resolvedDecorative.value,
			role: props.role,
			autoDetectButton: props.autoDetectButton,
		}
	})

	const svg = ref<ComponentPublicInstance | null>(null)

	// Vérification à l'initialisation du composant
	onMounted(() => {
		checkAccessibility(props.icon, resolvedDecorative.value, props.label)
		setWidth()
	})

	onUpdated(setWidth)

	function setWidth() {
		if (svg.value && props.width) {
			const iconElement = svg.value.$el?.querySelector('svg')

			if (iconElement) {
				iconElement.setAttribute('width', props.width)
			}
		}
	}

	// Vérification à chaque changement des props concernées
	watch(
		[() => props.decorative, () => props.label, () => props.icon],
		([, label, icon]) => {
			checkAccessibility(
				icon as string,
				resolvedDecorative.value,
				label as string | undefined,
			)
		},
	)
</script>

<template>
	<v-icon
		ref="svg"
		v-rgaa-svg-fix="rgaaSvgFixConfig"
		:color="props.color"
		:size="props.size"
		:role="props.role"
		:aria-label="resolvedDecorative ? undefined : props.label"
		:aria-hidden="resolvedDecorative ? true : undefined"
	>
		{{ icon }}
	</v-icon>
</template>
