<script lang="ts" setup>
	import { ref, computed, watch } from 'vue'
	import { mdiMagnify } from '@mdi/js'
	import type { PropType } from 'vue'
	import type { SearchListItem } from './types'
	import { locales } from './locales'

	import { SyTextField, SyCheckbox } from '@/components'

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
		bgColor: {
			type: String,
			default: 'white',
		},
		returnObject: {
			type: Boolean,
			default: false,
		},
	})

	const emit = defineEmits(['update:modelValue'])

	const search = ref<string | null>(null)
	const internalValue = ref<unknown[]>(props.modelValue)
	const searchIcon = mdiMagnify
	const checkboxListRef = ref<HTMLElement | null>(null)

	// Helper function for deep equality comparison
	const isEqual = (a: unknown, b: unknown): boolean => {
		if (a === b) return true
		if (a === null || b === null) return false
		if (typeof a !== 'object' || typeof b !== 'object') return false

		const keysA = Object.keys(a as Record<string, unknown>)
		const keysB = Object.keys(b as Record<string, unknown>)

		if (keysA.length !== keysB.length) return false

		for (const key of keysA) {
			if (!keysB.includes(key)) return false
			if (!isEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) return false
		}

		return true
	}

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
		return props.items.filter((item) => {
			return item.label.toLowerCase().includes(searchLower)
		})
	})

	const emitChangeEvent = (value: unknown[]) => {
		emit('update:modelValue', value)
	}

	const toggleSelection = (item: SearchListItem) => {
		const newValue = [...internalValue.value]
		const valueToEmit = props.returnObject ? item : item.value
		const index = newValue.findIndex(value => props.returnObject ? isEqual(value, item) : isEqual(value, item.value))
		
		if (index === -1) {
			newValue.push(valueToEmit)
		}
		else {
			newValue.splice(index, 1)
		}
		emitChangeEvent(newValue)
	}

	defineExpose({
		filteredItems,
		search,
		emitChangeEvent,
		toggleSelection,
	})
</script>

<template>
	<div class="vd-search-list">
		<SyTextField
			v-model="search"
			:label="locales.search"
			aria-describedby="search-description"
			aria-labelledby="search-label"
			hide-details
			color="primary"
			:variant="outlined ? 'outlined' : 'underlined'"
			clearable
			tabindex="0"
			:bg-color="props.bgColor"
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
			ref="checkboxListRef"
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
				:value="props.returnObject ? item : item.value"
				role="option"
				:aria-selected="internalValue.some(value => props.returnObject ? isEqual(value, item) : isEqual(value, item.value))"
				:tabindex="0"
				active-class="text-primary"
				class="d-flex align-center justify-start mx-4"
			>
				<template #prepend="{ isActive }">
					<VListItemAction start>
						<SyCheckbox
							:id="`checkbox-${index}`"
							:model-value="isActive"
							label=""
							:aria-label="`${locales.checkboxLabel} ${item.label}`"
							:title="`${locales.checkboxLabel} ${item.label}`"
							:aria-labelledby="`list-item-title-${index}`"
							hide-details
							class="ml-2 search-list-checkbox"
							density="compact"
							@click="toggleSelection(item)"
						/>
					</VListItemAction>

					<VListItemTitle :id="`list-item-title-${index}`">
						{{ item.label }}
					</VListItemTitle>
				</template>
			</VListItem>
		</VList>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.v-list {
	background: transparent;
}

.vd-search-list .v-list-item--active::before {
	opacity: 0;
}

/* Hide duplicate labels for accessibility */
.search-list-checkbox {
	/* Hide the label from screen readers but keep the checkbox visible */
	::v-deep(.v-label) {
		display: none;
	}
}
</style>
