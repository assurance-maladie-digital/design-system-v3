<script lang="ts" setup>
	import { ref, computed, watch } from 'vue'
	import { mdiMagnify } from '@mdi/js'
	import type { PropType } from 'vue'
	import type { SearchListItem } from './types'
	import { locales } from './locales'
	import { useAccessibility } from './composables/useAccessibility'

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
	})

	const emit = defineEmits(['update:modelValue'])

	const search = ref<string | null>(null)
	const internalValue = ref<unknown[]>(props.modelValue)
	const searchIcon = mdiMagnify
	const checkboxListRef = ref<HTMLElement | null>(null)

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

	const toggleSelection = (itemValue: unknown) => {
		const newValue = [...internalValue.value]
		const index = newValue.indexOf(itemValue)
		if (index === -1) {
			newValue.push(itemValue)
		}
		else {
			newValue.splice(index, 1)
		}
		emitChangeEvent(newValue)
	}

	// Use the composable to remove aria-describedby from checkboxes
	// Pass the ref to the VList and the filteredItems as a dependency
	useAccessibility(checkboxListRef, [filteredItems])

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
			ref="checkboxListRef"
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
				:aria-labelledby="`search-list-item-${index}`"
				:tabindex="0"
				active-class="text-primary"
				class="d-flex align-center justify-start mx-4"
			>
				<span
					:id="`search-list-item-label-${index}`"
					class="d-sr-only"
				>
					{{ item.label }}
				</span>
				<template #prepend="{ isActive }">
					<VListItemAction start>
						<SyCheckbox
							:id="`checkbox-${index}`"
							:model-value="isActive"
							:aria-label="`${locales.checkboxLabel} ${item.label}`"
							:title="`${locales.checkboxLabel} ${item.label}`"
							hide-details
							class="ml-2"
							density="compact"
							@click="toggleSelection(item.value)"
						/>
					</VListItemAction>

					<VListItemTitle>{{ item.label }}</VListItemTitle>
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

</style>
