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
			? 'rgba(255, 255, 255, .85)'
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

	const actionButtonColor = computed(() => {
		return theme.current.value.dark ? 'white' : 'primary'
	})
</script>

<template>
	<div
		:class="{ 'sy-row': row }"
		class="sy-data-list-item"
	>
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
			<span>{{ label }} :</span>
		</dt>

		<dd
			class="sy-data-list-item-value d-flex align-center ga-2"
			:class="{ 'has-icon': icon }"
		>
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
					:innerHTML="itemValue"
				/>

				<span
					v-else
					class="text-body-1"
					v-text="itemValue"
				/>
			</slot>
			<slot name="action">
				<VBtn
					v-if="action"
					class="sy-data-list-item-action-btn px-2"
					size="small"
					variant="tonal"
					:color="actionButtonColor"
					@click="emits('click:action')"
				>
					{{ action }}
				</VBtn>
			</slot>
		</dd>
	</div>
</template>

<style lang="scss" scoped>
.sy-row {
	display: flex;
	flex-wrap: wrap;
	gap: 0.25rem;

	.sy-data-list-item-label {
		align-self: center;
	}
}

.sy-data-list-item-value.has-icon {
	margin-left: 2.5rem;
}

.sy-data-list-item-action-btn.v-btn {
	&:focus-visible::after {
		opacity: 1;
	}
}

.v-icon.v-theme--light {
	color: rgb(0 0 0 / 54%);
}
</style>
