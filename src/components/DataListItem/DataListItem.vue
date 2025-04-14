<script lang="ts" setup>
	import { computed } from 'vue'
	import { useTheme } from 'vuetify'

	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'

	import { config } from './config'
	import { locales } from './locales'

	const props = withDefaults(defineProps<CustomizableOptions & {
		label: string
		value?: string | number
		action?: string
		placeholder?: string
		chip?: boolean
		icon?: string
		row?: boolean
		renderHtmlValue?: boolean
	}>(), {
		label: '',
		value: undefined,
		action: undefined,
		placeholder: locales.placeholder,
		chip: false,
		icon: undefined,
		row: false,
		renderHtmlValue: false,
	})

	const emits = defineEmits(['click:action'])

	const options = useCustomizableOptions(config, props)
	const theme = useTheme()

	const labelColor = computed(() => {
		return theme.current.value.dark
			? 'rgba(255, 255, 255, .7)'
			: 'rgba(0, 0, 0, .6)'
	})

	const itemValue = computed(() => {
		if (typeof props.value === 'number') {
			return isNaN(props.value)
				? props.placeholder
				: props.value.toString()
		}
		return props.value || props.placeholder
	})
</script>

<template>
	<li class="sy-data-list-item d-flex flex-wrap">
		<slot name="icon">
			<VIcon
				v-if="icon"
				v-bind="options.icon"
			>
				{{ icon }}
			</VIcon>
		</slot>

		<div class="sy-data-list-item-content">
			<div :class="{ 'sy-row': row }">
				<div
					class="sy-data-list-item-label text-caption"
					:style="{ color: labelColor }"
				>
					{{ label }}
				</div>

				<div class="sy-data-list-item-value">
					<slot
						name="value"
						v-bind="{ itemValue }"
					>
						<VChip
							v-if="chip"
							v-bind="options.chip"
						>
							{{ itemValue }}
						</VChip>

						<span
							v-else-if="renderHtmlValue"
							class="text-body-1"
							v-html="itemValue"
						/>

						<span
							v-else
							class="text-body-1"
							v-text="itemValue"
						/>
					</slot>
				</div>
			</div>

			<slot name="action">
				<VBtn
					v-if="action"
					v-bind="options.actionBtn"
					class="sy-data-list-item-action-btn"
					@click="emits('click:action')"
				>
					{{ action }}
				</VBtn>
			</slot>
		</div>
	</li>
</template>

<style lang="scss" scoped>
.sy-row {
	display: flex;
	flex-wrap: wrap;

	.sy-data-list-item-label {
		align-self: center;

		&::after {
			content: ':';
			margin: 0 4px;
		}
	}
}

.sy-data-list-item-action-btn.v-btn {
	min-width: 0;
	margin: 0 -1px;
}

.v-icon.v-theme--light {
	color: rgb(0 0 0 / 54%);
}
</style>
