<script setup lang="ts">
	import { ref } from 'vue'
	import { VMenu, VIcon, VBtn } from 'vuetify/components'
	import { mdiContentCopy } from '@mdi/js'

	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { copyToClipboard } from '@/utils/functions/copyToClipboard'

	import { locales } from './locales'
	import { config } from './config'

	const props = withDefaults(defineProps<CustomizableOptions & {
		label: string
		textToCopy: (() => string) | string
		hideTooltip?: boolean
		tooltipDuration?: number
	}>(), {
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
	<div class="vd-copy-btn">
		<VMenu
			v-model="tooltip"
			v-bind="options.menu"
			:disabled="props.hideTooltip"
			transition="fade-transition"
		>
			<template #activator="{ props: menuProps }">
				<VBtn
					v-bind="{ ...menuProps, ...options.btn }"
					:aria-label="props.label"
					data-test-id="copy-btn"
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
@use '@/assets/tokens.scss';

.vd-copy-tooltip-menu {
  padding: 6px 16px;
  box-shadow: none;
  margin-top: 2px;
  background: rgba(97, 97, 97, 0.9);
  color: white;
}

.v-btn--icon .v-icon {
  color: tokens.$grey-lighten-20;
}
</style>
