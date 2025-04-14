<script setup lang="ts">
	import { ref } from 'vue'
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
	}>(), {
		ariaLabel: 'bouton de copie',
		ariaOwns: 'copy-btn',
		textToCopy: '',
		hideTooltip: false,
		tooltipDuration: 5000,
	})

	const options = useCustomizableOptions(config, props)

	const tooltip = ref(false)
	const copyIcon = mdiContentCopy

	function copy(): void {
		const contentToCopy
			= typeof props.textToCopy === 'function'
				? props.textToCopy()
				: props.textToCopy

		copyToClipboard(contentToCopy)

		if (props.hideTooltip) {
			return
		}

		setTimeout(() => {
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
