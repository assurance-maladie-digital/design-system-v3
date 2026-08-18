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
	<VIcon
		ref="svg"
		v-rgaa-svg-fix="rgaaSvgFixConfig"
		:color="props.color"
		:size="props.size"
		:role="props.role"
		:aria-label="resolvedDecorative ? undefined : props.label"
		:aria-hidden="resolvedDecorative ? true : undefined"
	>
		{{ icon }}
	</VIcon>
</template>

<style lang="scss" scoped>
// Quand SyIcon est interactif (`role="button"` → la directive `rgaaSvgFix` ajoute `tabindex="0"`),
// il devient focusable au clavier. Or le `.v-icon` est un `<i>`, ni `<button>` ni `.v-btn` :
// l'override global `_btns.scss` ne le couvre PAS. On ajoute donc le ring DS ici, aligné sur la
// convention bouton (offset 3px, comme `_btns.scss`) ; radius pour épouser la forme.
.v-icon[role='button']:focus-visible {
	outline: 2px solid rgb(var(--v-theme-primary));
	outline-offset: 3px;
	border-radius: 4px;
}

// Sur fond sombre, le ring passe en onPrimary, comme les boutons/liens.
.v-theme--dark .v-icon[role='button']:focus-visible {
	outline-color: rgb(var(--v-theme-on-primary));
}
</style>
