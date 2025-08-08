<script lang="ts" setup>
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { computed } from 'vue'
	import { useTheme } from 'vuetify'
	import SyIcon from '../Customs/SyIcon/SyIcon.vue'
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
			: 'rgba(255, 255, 255, .85)'
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
	<dt
		class="sy-data-list-item-label text-caption"
		:style="{ color: labelColor }"
	>
		<slot name="icon">
			<SyIcon
				v-if="icon"
				v-bind="options.icon"
				:icon="icon"
				:decorative="true"
			/>
		</slot>
		{{ label }} :
	</dt>

	<dd class="sy-data-list-item-value mb-2 d-flex align-center ga-2">
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

			<slot name="action">
				<VBtn
					v-if="action"
					class="sy-data-list-item-action-btn text-body-1 px-2"
					size="small"
					variant="text"
					@click="emits('click:action')"
				>
					{{ action }}
				</VBtn>
			</slot>
		</slot>
	</dd>
</template>

<style lang="scss" scoped>
.sy-data-list-item-action-btn.v-btn {
	&:focus-visible::after {
		opacity: 1;
	}
}

.v-icon.v-theme--light {
	color: rgb(0 0 0 / 54%);
}
</style>
