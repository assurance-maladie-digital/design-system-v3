<script lang="ts" setup>
	import { ref, computed, watch } from 'vue'
	import { mdiMagnify } from '@mdi/js'
	import type { PropType } from 'vue'
	import type { SearchListItem } from './types'
	import { locales } from './locales'

	import { SyTextField } from '@/components'

	const props = defineProps({
		modelValue: {
			type: Array as PropType<unknown[]>,
			default: () => [],
		},
		items: {
			type: Array as PropType<SearchListItem[]>,
			default: () => [],
		},
		outlined: {
			type: Boolean,
			default: true,
		},
	})

	const emit = defineEmits(['update:modelValue'])

	const search = ref<string | null>(null)
	const internalValue = ref<unknown[]>(props.modelValue)
	const searchIcon = mdiMagnify

	watch(
		() => props.modelValue,
		(newValue) => {
			internalValue.value = newValue
		},
	)

	const filteredItems = computed(() => {
		if (search.value === null) {
			return props.items
		}
		const searchLower = search.value.toLowerCase()
		return props.items.filter(item =>
			item.label.toLowerCase().includes(searchLower),
		)
	})

	const emitChangeEvent = (value: unknown[]) => {
		emit('update:modelValue', value)
	}
</script>

<template>
	<div class="vd-search-list">
		<SyTextField
			:model-value="search"
			:label="locales.search"
			aria-describedby="search-description"
			aria-labelledby="search-label"
			hide-details
			color="primary"
			:variant="outlined ? 'outlined' : 'underlined'"
			clearable
			tabindex="0"
		>
			<template #prepend-inner>
				<VIcon class="mr-1">
					{{ searchIcon }}
				</VIcon>
			</template>
		</SyTextField>

		<!-- eslint-disable-next-line  vuejs-accessibility/label-has-for -->
		<label
			id="search-label"
			class="d-sr-only"
		>
			{{ locales.search }}
		</label>
		<span
			id="search-description"
			class="d-sr-only"
		>
			{{ locales.search }}
		</span>

		<VList
			id="search-list"
			v-model:selected="internalValue"
			title="search-list"
			select-strategy="classic"
			class="pb-0"
			role="listbox"
			aria-labelledby="search-list-title"
			@update:selected="emitChangeEvent"
		>
			<h2
				id="search-list-title"
				class="d-sr-only"
			>
				{{ locales.searchListTitle }}
			</h2>
			<VListItem
				v-for="(item, index) in filteredItems"
				:id="`search-list-item-${index}`"
				:key="index"
				:value="item.value"
				role="option"
				:aria-selected="internalValue.includes(item.value)"
				:aria-labelledby="`search-list-item-label-${index}`"
				:tabindex="0"
				active-class="text-primary"
				class="d-flex align-center justify-start"
			>
				<span
					:id="`search-list-item-label-${index}`"
					class="d-sr-only"
				>
					{{ item.label }}
				</span>
				<template #prepend="{ isActive }">
					<VListItemAction start>
						<input
							:id="`checkbox-${index}`"
							type="checkbox"
							:checked="isActive"
							:aria-label="`${locales.checkboxLabel} ${item.label}`"
							:title="`${locales.checkboxLabel} ${item.label}`"
							class="custom-checkbox"
							@change="$emit('update:modelValue', !isActive)"
						>
						<!-- eslint-disable-next-line  vuejs-accessibility/label-has-for -->
						<label
							:for="`checkbox-${index}`"
							class="d-sr-only"
						>
							{{ locales.checkboxLabel }}
						</label>
					</VListItemAction>

					<VListItemTitle>{{ item.label }}</VListItemTitle>
				</template>
			</VListItem>
		</VList>
	</div>
</template>

<style lang="scss" scoped>
.v-list {
	background: transparent;
}

.vd-search-list .v-list-item--active::before {
	opacity: 0;
}
</style>
