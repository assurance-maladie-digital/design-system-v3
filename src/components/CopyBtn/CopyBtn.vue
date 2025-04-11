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
		ariaLabel: 'copy-btn',
		ariaOwns: 'copy-btn',
		textToCopy: '',
		hideTooltip: false,
		tooltipDuration: 2500,
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
		class="vd-copy-btn"
	>
		<VMenu
			v-bind="options.menu"
			:id="props.ariaOwns"
			v-model="tooltip"
			:disabled="props.hideTooltip"
			transition="fade-transition"
		>
			<template #activator="{ props: menuProps }">
				<VBtn
					v-bind="{ ...menuProps, ...options.btn }"
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

			<slot name="tooltip">
				{{ locales.tooltip }}
			</slot>
		</VMenu>
	</div>
</template>

<style lang="scss">
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

.sy-copy-tooltip-menu {
	padding: 6px 16px;
	box-shadow: none;
	margin-top: 2px;
	background: rgb(84 88 89 / 95%);
	color: white;
}

.v-btn--icon .v-icon {
	color: tokens.$grey-lighten-20;
}
</style>
