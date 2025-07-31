<script setup lang="ts">
	import { ref, onUnmounted } from 'vue'
	import { mdiContentCopy } from '@mdi/js'

	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { copyToClipboard } from '@/utils/functions/copyToClipboard'

	import { locales } from './locales'
	import { config } from './config'

	const props = withDefaults(defineProps<CustomizableOptions & {
		ariaLabel?: string
		ariaOwns?: string
		textToCopy: (() => string) | string
		hideTooltip?: boolean
		tooltipDuration?: number
		separatorsToRemove?: string | string[]
	}>(), {
		ariaLabel: 'bouton de copie',
		ariaOwns: 'copy-btn',
		textToCopy: '',
		hideTooltip: false,
		tooltipDuration: 5000,
		separatorsToRemove: undefined,
	})

	const options = useCustomizableOptions(config, props)

	const tooltip = ref(false)
	const copyIcon = mdiContentCopy
	let tooltipTimeoutId: ReturnType<typeof setTimeout> | undefined

	onUnmounted(() => {
		if (tooltipTimeoutId !== undefined) {
			clearTimeout(tooltipTimeoutId)
		}
	})

	function copy(): void {
		let contentToCopy
			= typeof props.textToCopy === 'function'
				? props.textToCopy()
				: props.textToCopy

		if (contentToCopy && props.separatorsToRemove?.length) {
			// Supprimer les espaces
			contentToCopy = contentToCopy.replace(/\s+/g, '')

			// Supprimer les séparateurs supplémentaires
			if (props.separatorsToRemove) {
				if (Array.isArray(props.separatorsToRemove)) {
					// Si c'est un tableau, créer une regex avec tous les séparateurs
					const separatorsPattern = props.separatorsToRemove
						.map(sep => sep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Échapper les caractères spéciaux
						.join('|')
					if (separatorsPattern) {
						const regex = new RegExp(separatorsPattern, 'g')
						contentToCopy = contentToCopy.replace(regex, '')
					}
				}
				else if (typeof props.separatorsToRemove === 'string' && props.separatorsToRemove !== '') {
					// Si c'est une chaîne, remplacer directement
					const escapedSeparator = props.separatorsToRemove.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
					const regex = new RegExp(escapedSeparator, 'g')
					contentToCopy = contentToCopy.replace(regex, '')
				}
			}
		}

		copyToClipboard(contentToCopy)

		if (props.hideTooltip) {
			return
		}

		tooltipTimeoutId = setTimeout(() => {
			tooltip.value = false
		}, props.tooltipDuration)
	}

	defineExpose({
		copy,
		tooltip,
	})
</script>

<template>
	<div
		:id="props.ariaOwns"
		class="sy-copy-btn"
	>
		<VTooltip
			v-model="tooltip"
			location="right"
			:open-on-click="true"
			:open-on-hover="false"
			:disabled="hideTooltip"
		>
			<template #activator="{ props: tooltipProps }">
				<VBtn
					v-bind="{...tooltipProps,...options.btn}"
					:aria-label="props.ariaLabel"
					:aria-owns="props.ariaOwns"
					:data-test-id="props.ariaOwns"
					aria-controls="copy-btn"
					@click="copy"
				>
					<slot name="icon">
						<VIcon v-bind="options.icon">
							{{ copyIcon }}
						</VIcon>
					</slot>
				</VBtn>
			</template>
			<span
				role="status"
			><slot name="tooltip">{{ locales.tooltip }}</slot></span>
		</VTooltip>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.v-btn:deep() {
	.v-btn__underlay,
	.v-btn__overlay {
		display: none;
	}
}

.v-btn {
	outline: 0;
}

.v-btn:focus-visible {
	background: rgb(84 88 89 / 7%);
}

.v-btn--icon .v-icon {
	color: tokens.$grey-lighten-20;
}
</style>
