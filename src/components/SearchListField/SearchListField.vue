<script lang="ts" setup>
	import { ref, computed, watch } from 'vue'
	import { mdiMagnify } from '@mdi/js'
	import type { PropType } from 'vue'
	import type { SearchListItem } from './types'
	import { locales } from './locales'

	const props = defineProps({
		modelValue: {
			type: Array as PropType<unknown[]>,
			default: () => [],
		},
		items: {
			type: Array as PropType<SearchListItem[]>,
			default: () => [],
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
	<div
		class="vd-search-list"
		role="search"
		aria-labelledby="search-list-title"
	>
		<VTextField
			v-model="search"
			:label="locales.search"
			:aria-label="locales.search"
			:title="locales.search"
			hide-details
			role="combobox"
			aria-expanded="true"
			aria-controls="filtered-list"
			variant="outlined"
			color="primary"
			clearable
		>
			<template #prepend-inner>
				<VIcon class="mr-1">
					{{ searchIcon }}
				</VIcon>
			</template>
		</VTextField>

		<VList
			v-model:selected="internalValue"
			select-strategy="classic"
			class="pb-0"
			role="listbox"
			aria-labelledby="search-list"
			@update:selected="emitChangeEvent"
		>
			<VListItem
				v-for="(item, index) in filteredItems"
				:key="index"
				:value="item.value"
				role="menuitem"
				:tabindex="0"
				active-class="text-primary"
				class="d-flex align-center justify-start"
				:aria-selected="internalValue.includes(item.value)"
				:aria-label="item.label"
			>
				<template #prepend="{ isActive }">
					<VListItemAction start>
						<VCheckboxBtn
							:model-value="isActive"
							:aria-label="`${locales.checkboxLabel} ${item.label}`"
						>
							<template #label>
								<span class="d-sr-only">
									{{ locales.checkboxLabel }}
								</span>
							</template>
						</VCheckboxBtn>
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
